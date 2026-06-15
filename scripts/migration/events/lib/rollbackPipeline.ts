import fs from 'fs'

import type { WhatsOn } from '@/payload-types'

import type { MigrationCliOptions } from '../../lib/cli.js'
import { writeJsonReport } from '../../lib/fs.js'
import {
  loadMediaManifest,
  purgeMediaIdsFromManifest,
  saveMediaManifest,
  type MediaUploadManifest,
} from './eventsMedia.js'
import { listUniqueMigrationImagePaths } from './legacyImages.js'
import { getMigrationEventBatch } from './migrationBatch.js'
import { IMPORT_REPORT_PATH, PROGRESS_REPORT_PATH } from './reportPaths.js'
import {
  getPendingRollbackEntries,
  loadRollbackLog,
  saveRollbackLog,
  type RollbackLogEntry,
} from './rollbackLog.js'

export type RollbackResult = {
  legacyIndex: number
  slug: string
  action: 'deleted' | 'branch_removed' | 'skipped'
  reason?: string
}

type ImportReportEvent = {
  legacyIndex?: number
  slug?: string
  imported?: boolean
  branchMerged?: boolean
}

type ImportReport = {
  dryRun: boolean
  generatedAt?: string
  events: ImportReportEvent[]
}

function getWhatsOnBranchIds(branch: unknown): number[] {
  if (!Array.isArray(branch)) return []

  return branch
    .map((entry) => {
      if (typeof entry === 'number') return entry
      if (entry && typeof entry === 'object' && 'id' in entry) {
        const id = (entry as { id?: unknown }).id
        return typeof id === 'number' ? id : null
      }
      return null
    })
    .filter((id): id is number => typeof id === 'number')
}

function getWhatsOnMediaId(media: unknown): number | null {
  if (typeof media === 'number') return media
  if (media && typeof media === 'object' && 'id' in media) {
    const id = (media as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

function getWhatsOnGalleryIds(gallery: unknown): number[] {
  if (!Array.isArray(gallery)) return []

  return gallery
    .map((entry) => {
      if (typeof entry === 'number') return entry
      if (entry && typeof entry === 'object' && 'id' in entry) {
        const id = (entry as { id?: unknown }).id
        return typeof id === 'number' ? id : null
      }
      return null
    })
    .filter((id): id is number => typeof id === 'number')
}

function collectMediaIds(doc: WhatsOn): number[] {
  const ids = new Set<number>()
  const mediaId = getWhatsOnMediaId(doc.media)
  if (mediaId) ids.add(mediaId)
  for (const id of getWhatsOnGalleryIds(doc.gallery)) {
    ids.add(id)
  }
  return [...ids]
}

async function isMediaStillReferenced(
  payload: import('payload').Payload,
  mediaId: number,
): Promise<boolean> {
  const { docs: byMedia } = await payload.find({
    collection: 'whats-on',
    where: { media: { equals: mediaId } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  if (byMedia.length) return true

  const { docs } = await payload.find({
    collection: 'whats-on',
    limit: 500,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  return docs.some((doc) => getWhatsOnGalleryIds(doc.gallery).includes(mediaId))
}

function removeSlugFingerprint(manifest: MediaUploadManifest, slug: string) {
  if (!manifest.slugFingerprints?.[slug]) return
  delete manifest.slugFingerprints[slug]
}

function purgeDeletedMediaFromManifest(
  manifest: MediaUploadManifest,
  deletedMediaIds: Set<number>,
) {
  if (deletedMediaIds.size > 0) {
    purgeMediaIdsFromManifest(manifest, deletedMediaIds)
  }
}

function removeFromProgress(legacyIndex: number) {
  if (!fs.existsSync(PROGRESS_REPORT_PATH)) return

  const progress = JSON.parse(fs.readFileSync(PROGRESS_REPORT_PATH, 'utf8')) as {
    completedIndexes?: number[]
  }

  if (!progress.completedIndexes?.includes(legacyIndex)) return

  progress.completedIndexes = progress.completedIndexes.filter((index) => index !== legacyIndex)
  writeJsonReport(PROGRESS_REPORT_PATH, progress)
}

function loadImportReportFallback(): RollbackLogEntry[] {
  if (!fs.existsSync(IMPORT_REPORT_PATH)) return []

  const report = JSON.parse(fs.readFileSync(IMPORT_REPORT_PATH, 'utf8')) as ImportReport
  if (report.dryRun) return []

  const entries: RollbackLogEntry[] = []

  for (const event of report.events) {
    if (!event.legacyIndex || !event.slug) continue
    if (!event.imported && !event.branchMerged) continue

    const { mapped } = getMigrationEventBatch({ indexes: [event.legacyIndex] })
    const mappedEvent = mapped[0]
    if (!mappedEvent) continue

    entries.push({
      legacyIndex: event.legacyIndex,
      legacyId: mappedEvent.legacyId,
      slug: event.slug,
      branchSlug: mappedEvent.branchSlug,
      action: event.branchMerged ? 'branch_merged' : 'created',
      mediaLegacyPaths: listUniqueMigrationImagePaths([mappedEvent]),
      migratedAt: report.generatedAt ?? new Date().toISOString(),
    })
  }

  return [...entries].reverse()
}

async function rollbackEntry(
  entry: RollbackLogEntry,
  payload: import('payload').Payload,
  branchCache: Map<string, number | null>,
  manifest: MediaUploadManifest | null,
  dryRun: boolean,
): Promise<RollbackResult> {
  const { resolveBranchId } = await import('../../lib/getPayloadLocal.js')

  if (!branchCache.has(entry.branchSlug)) {
    branchCache.set(entry.branchSlug, await resolveBranchId(payload, entry.branchSlug))
  }

  const branchId = branchCache.get(entry.branchSlug)
  if (!branchId) {
    return {
      legacyIndex: entry.legacyIndex,
      slug: entry.slug,
      action: 'skipped',
      reason: `Branch not found: ${entry.branchSlug}`,
    }
  }

  const { docs } = await payload.find({
    collection: 'whats-on',
    where: { slug: { equals: entry.slug } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  const doc = docs[0] as WhatsOn | undefined
  if (!doc) {
    return {
      legacyIndex: entry.legacyIndex,
      slug: entry.slug,
      action: 'skipped',
      reason: 'Record not found',
    }
  }

  if (entry.action === 'branch_merged') {
    const branchIds = getWhatsOnBranchIds(doc.branch)
    if (!branchIds.includes(branchId)) {
      return {
        legacyIndex: entry.legacyIndex,
        slug: entry.slug,
        action: 'skipped',
        reason: 'Branch not on record',
      }
    }

    const remaining = branchIds.filter((id) => id !== branchId)
    if (remaining.length === 0) {
      return {
        legacyIndex: entry.legacyIndex,
        slug: entry.slug,
        action: 'skipped',
        reason: 'Cannot remove last branch from record',
      }
    }

    console.log(`  remove branch ${entry.branchSlug} from ${entry.slug}`)

    if (!dryRun) {
      await payload.update({
        collection: 'whats-on',
        id: doc.id,
        data: { branch: remaining },
        overrideAccess: true,
      })
    }

    return { legacyIndex: entry.legacyIndex, slug: entry.slug, action: 'branch_removed' }
  }

  const mediaIds = collectMediaIds(doc)
  console.log(`  delete whats-on: ${entry.slug}`)
  if (mediaIds.length) {
    console.log(`  media candidates: ${mediaIds.join(', ')}`)
  }

  if (!dryRun) {
    await payload.delete({
      collection: 'whats-on',
      id: doc.id,
      overrideAccess: true,
    })

    const deletedMediaIds = new Set<number>()

    for (const mediaId of mediaIds) {
      const stillReferenced = await isMediaStillReferenced(payload, mediaId)
      if (stillReferenced) {
        console.log(`  keep media ${mediaId} (still referenced)`)
        continue
      }

      await payload.delete({
        collection: 'media',
        id: mediaId,
        overrideAccess: true,
      })
      deletedMediaIds.add(mediaId)
      console.log(`  deleted media ${mediaId}`)
    }

    if (manifest) {
      removeSlugFingerprint(manifest, entry.slug)
      purgeDeletedMediaFromManifest(manifest, deletedMediaIds)
      saveMediaManifest(manifest, options.remote)
    }

    removeFromProgress(entry.legacyIndex)
  }

  return { legacyIndex: entry.legacyIndex, slug: entry.slug, action: 'deleted' }
}

export async function runRollbackPipeline(options: MigrationCliOptions) {
  if (options.dryRun) {
    console.log('DRY RUN — no deletions. Pass --write to rollback.')
  } else {
    console.log('ROLLBACK — deleting migrated records. Pass without --write for preview only.')
  }

  const log = loadRollbackLog()
  let entries: RollbackLogEntry[] = log ? getPendingRollbackEntries(log, options.indexes) : []

  if (!entries.length) {
    entries = loadImportReportFallback()
    if (options.indexes) {
      const indexSet = new Set(options.indexes)
      entries = entries.filter((entry) => indexSet.has(entry.legacyIndex))
    }
  }

  if (!entries.length) {
    const logExists = Boolean(log?.entries.length)
    const hint = logExists
      ? 'All log entries may already be rolled back, or --indexes did not match.'
      : 'Run `pnpm migrate:events --write` first to create rollback-log.json.'

    throw new Error(`No rollback entries found. ${hint}`)
  }

  console.log(`\nRolling back ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}:`)
  for (const entry of entries) {
    console.log(
      `  [${entry.legacyIndex}] ${entry.action} ${entry.slug} (${entry.branchSlug})`,
    )
  }

  const payload = options.dryRun
    ? null
    : await import('../../lib/getPayloadLocal.js').then((m) => m.getMigrationPayload())

  const manifest = loadMediaManifest(options.remote)
  const branchCache = new Map<string, number | null>()
  const results: RollbackResult[] = []

  for (const entry of entries) {
    console.log(`\n=== Index ${entry.legacyIndex} ===`)

    if (options.dryRun || !payload) {
      if (entry.action === 'branch_merged') {
        console.log(`  would remove branch ${entry.branchSlug} from ${entry.slug}`)
        results.push({
          legacyIndex: entry.legacyIndex,
          slug: entry.slug,
          action: 'branch_removed',
        })
      } else {
        console.log(`  would delete whats-on: ${entry.slug}`)
        results.push({ legacyIndex: entry.legacyIndex, slug: entry.slug, action: 'deleted' })
      }
      continue
    }

    const result = await rollbackEntry(entry, payload, branchCache, manifest, false)
    results.push(result)

    if (log) {
      const target = log.entries.find(
        (item: RollbackLogEntry) =>
          item.legacyIndex === entry.legacyIndex &&
          item.slug === entry.slug &&
          item.action === entry.action &&
          !item.rolledBackAt,
      )
      if (target) {
        target.rolledBackAt = new Date().toISOString()
      }
    }
  }

  if (log && !options.dryRun) {
    saveRollbackLog(log)
  }

  const deleted = results.filter((item) => item.action === 'deleted').length
  const branchRemoved = results.filter((item) => item.action === 'branch_removed').length
  const skipped = results.filter((item) => item.action === 'skipped').length

  console.log('\nRollback complete')
  console.log(`Deleted:        ${deleted}`)
  console.log(`Branch removed: ${branchRemoved}`)
  console.log(`Skipped:        ${skipped}`)
}
