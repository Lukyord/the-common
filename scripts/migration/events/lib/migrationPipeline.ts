import type { WhatsOn } from '@/payload-types'

import type { MigrationCliOptions } from '../../lib/cli.js'
import { printDryRunBanner } from '../../lib/cli.js'
import { writeJsonReport } from '../../lib/fs.js'
import { getMigrationCutoffDate, toIsoDate } from '../../lib/legacy.js'
import { loadLegacyEvents } from './loadLegacyEvents.js'
import { cleanupEventMediaCache } from './cleanupMediaCache.js'
import {
  ensureManifestImageCached,
  extractColorForLegacyPath,
  getDominantColorFromManifest,
  getMediaIdFromManifest,
  getValidatedMediaIdFromManifest,
  loadMediaManifest,
  recordSlugFingerprint,
  sanitizeMediaManifest,
  saveMediaManifest,
  uploadLegacyMediaFile,
  type MediaUploadManifest,
} from './eventsMedia.js'
import { legacyPathToUrl, listUniqueMigrationImagePaths } from './legacyImages.js'
import { getMigrationEventBatch, resolveMigrationIndexes } from './migrationBatch.js'
import {
  ANALYSIS_REPORT_PATH,
  EVENTS_MAPPED_REPORT_PATH,
  IMPORT_REPORT_PATH,
  PROGRESS_REPORT_PATH,
} from './reportPaths.js'
import { resolveGalleryMediaIds } from './resolveGalleryMediaIds.js'
import { appendRollbackLog } from './rollbackLog.js'
import type { MappedLegacyEvent, MigrationAnalysis } from './types.js'
import { REPORTS_DIR } from '../config/constants.js'

export type SingleEventMigrationResult = {
  legacyIndex: number
  skipped: boolean
  skippedReason?: string
  title?: string
  slug?: string
  mediaUploaded?: number
  mediaCached?: number
  mediaFailed?: number
  imported?: boolean
  skippedExisting?: boolean
  branchMerged?: boolean
  cacheCleaned?: number
}

export type AnalyzeStepResult = {
  analysis: MigrationAnalysis
  eligibleCount: number
  selectedIndexes: number[] | null
}

export function runAnalyzeStep(options: MigrationCliOptions): AnalyzeStepResult {
  const cutoff = getMigrationCutoffDate()
  const legacyEvents = loadLegacyEvents()
  const { legacyTotal, selectedIndexes, mapped, eligible } = getMigrationEventBatch(options, cutoff)
  const discarded = mapped.filter((event) => event.skippedReason)

  const tagStats: Record<string, number> = {}
  for (const event of eligible) {
    if (event.mainTag) tagStats[event.mainTag] = (tagStats[event.mainTag] ?? 0) + 1
    for (const subTag of event.subTags) {
      tagStats[subTag] = (tagStats[subTag] ?? 0) + 1
    }
  }

  const analysis: MigrationAnalysis = {
    generatedAt: new Date().toISOString(),
    cutoffDate: toIsoDate(cutoff),
    totals: {
      legacy: legacyTotal,
      selected: mapped.length,
      eligible: eligible.length,
      discardedByAge: discarded.filter((event) => event.skippedReason?.includes('before cutoff'))
        .length,
      discardedNoDate: discarded.filter(
        (event) =>
          event.skippedReason?.includes('Missing when') ||
          event.skippedReason?.includes('Could not parse date'),
      ).length,
      discardedNoBranch: discarded.filter((event) =>
        event.skippedReason?.includes('Unknown branch'),
      ).length,
      withMediaPath: eligible.filter((event) => event.mediaPath).length,
      withGallery: eligible.filter((event) => event.galleryPaths.length > 0).length,
      duplicateSlugsResolved: eligible.filter((event) => event.slug !== event.legacySlug).length,
      dateParseFailed: discarded.filter((event) => event.skippedReason?.includes('Could not parse'))
        .length,
    },
    tagStats,
    warnings: [],
    sampleEligible: eligible.slice(0, 10),
    sampleDiscarded: discarded.slice(0, 20).map((event) => ({
      name: event.title,
      reason: event.skippedReason ?? 'Unknown',
      legacyIndex: event.legacyIndex,
      when: legacyEvents.find((item) => item._id.$oid === event.legacyId)?.when,
    })),
  }

  if (selectedIndexes) {
    analysis.warnings.push(`Selected legacy indexes: ${selectedIndexes.join(', ')}`)
  }

  writeJsonReport(ANALYSIS_REPORT_PATH, analysis)
  writeJsonReport(EVENTS_MAPPED_REPORT_PATH, mapped)

  console.log(`Cutoff date (>=): ${analysis.cutoffDate}`)
  console.log(`Legacy total:     ${analysis.totals.legacy}`)
  if (selectedIndexes) {
    console.log(
      `Selected:         ${analysis.totals.selected} (indexes: ${selectedIndexes.join(', ')})`,
    )
  }
  console.log(`Eligible:         ${analysis.totals.eligible}`)

  return { analysis, eligibleCount: eligible.length, selectedIndexes }
}

async function buildWhatsOnData(
  payload: import('payload').Payload,
  event: MappedLegacyEvent,
  branchIds: number[],
  manifest: MediaUploadManifest | null,
) {
  const { resolveMainTagId, resolveSubTagIds } = await import('../../lib/getPayloadLocal.js')
  const mainTagId = event.mainTag ? await resolveMainTagId(payload, event.mainTag) : null
  const subTagIds = event.subTags.length ? await resolveSubTagIds(payload, event.subTags) : []

  const mediaId = manifest
    ? await getValidatedMediaIdFromManifest(payload, manifest, event.mediaPath)
    : null
  const bgColor = manifest ? getDominantColorFromManifest(manifest, event.mediaPath) : null
  const galleryIds = await resolveGalleryMediaIds(payload, event, manifest, mediaId)

  const { htmlToLexicalContent } = await import('../../lib/htmlToLexicalContent.js')

  return {
    title: event.title,
    slug: event.slug,
    branch: branchIds,
    dateToBeArchived: event.dateToBeArchived ?? undefined,
    eventSchedule: event.eventSchedule!,
    time: event.time ?? undefined,
    mainTag: mainTagId ?? undefined,
    subTags: subTagIds.length ? subTagIds : undefined,
    content: (await htmlToLexicalContent(event.contentHtml)) ?? undefined,
    media: mediaId ?? undefined,
    gallery: galleryIds.length ? galleryIds : undefined,
    bgColor: bgColor ?? undefined,
    meta: event.metaDescription ? { description: event.metaDescription } : undefined,
  }
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
    .sort((a, b) => a - b)
}

function existingMatchesEvent(
  event: MappedLegacyEvent,
  existing: WhatsOn,
  manifest: MediaUploadManifest | null,
  ourMediaId: number | null,
  ourGalleryIds: number[],
): boolean {
  const storedFingerprint = manifest?.slugFingerprints?.[existing.slug]
  if (storedFingerprint) {
    return storedFingerprint === event.fingerprint
  }

  const existingMediaId = getWhatsOnMediaId(existing.media)
  if (existingMediaId !== ourMediaId) return false

  const existingGalleryIds = getWhatsOnGalleryIds(existing.gallery)
  const sortedOurGalleryIds = [...ourGalleryIds].sort((a, b) => a - b)
  if (JSON.stringify(existingGalleryIds) !== JSON.stringify(sortedOurGalleryIds)) {
    return false
  }

  const existingDesc =
    existing.meta && typeof existing.meta === 'object' && 'description' in existing.meta
      ? ((existing.meta as { description?: string }).description ?? null)
      : null

  return (event.metaDescription ?? null) === existingDesc
}

async function findAvailableSlug(
  payload: import('payload').Payload,
  baseSlug: string,
  legacyId: string,
  reservedSlugs: Set<string>,
): Promise<string> {
  const usedSlugs = new Set(reservedSlugs)

  async function isSlugTaken(slug: string): Promise<boolean> {
    if (usedSlugs.has(slug)) return true

    const { docs } = await payload.find({
      collection: 'whats-on',
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
      overrideAccess: true,
    })

    return docs.length > 0
  }

  if (!(await isSlugTaken(baseSlug))) {
    usedSlugs.add(baseSlug)
    return baseSlug
  }

  let candidate = `${baseSlug}-${legacyId.slice(-6)}`
  let index = 2

  while (await isSlugTaken(candidate)) {
    candidate = `${baseSlug}-${legacyId.slice(-6)}-${index}`
    index += 1
  }

  usedSlugs.add(candidate)
  return candidate
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

async function importSingleEvent(
  event: MappedLegacyEvent,
  manifest: MediaUploadManifest | null,
  payload: import('payload').Payload,
  branchCache: Map<string, number | null>,
): Promise<{
  imported: boolean
  skippedExisting: boolean
  branchMerged: boolean
  slug: string
  error?: string
}> {
  const { resolveBranchId } = await import('../../lib/getPayloadLocal.js')

  if (!branchCache.has(event.branchSlug)) {
    branchCache.set(event.branchSlug, await resolveBranchId(payload, event.branchSlug))
  }

  const branchId = branchCache.get(event.branchSlug)
  if (!branchId) {
    return {
      imported: false,
      skippedExisting: false,
      branchMerged: false,
      slug: event.slug,
      error: `Branch not found: ${event.branchSlug}`,
    }
  }

  if (event.mediaPath && manifest) {
    const mediaId = await getValidatedMediaIdFromManifest(payload, manifest, event.mediaPath)
    if (!mediaId) {
      return {
        imported: false,
        skippedExisting: false,
        branchMerged: false,
        slug: event.slug,
        error: 'Missing media in manifest',
      }
    }
  }

  const ourMediaId = manifest
    ? await getValidatedMediaIdFromManifest(payload, manifest, event.mediaPath)
    : null
  const ourGalleryIds = await resolveGalleryMediaIds(payload, event, manifest, ourMediaId)
  const reservedSlugs = new Set(Object.keys(manifest?.slugFingerprints ?? {}))

  let slug = event.slug

  const { docs: existingDocs } = await payload.find({
    collection: 'whats-on',
    where: { slug: { equals: slug } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  if (existingDocs[0]) {
    const existing = existingDocs[0] as WhatsOn
    const existingBranchIds = getWhatsOnBranchIds(existing.branch)
    const matches = existingMatchesEvent(event, existing, manifest, ourMediaId, ourGalleryIds)

    if (matches) {
      if (!existingBranchIds.includes(branchId)) {
        await payload.update({
          collection: 'whats-on',
          id: existing.id,
          data: { branch: [...existingBranchIds, branchId] },
          overrideAccess: true,
        })

        if (manifest) {
          recordSlugFingerprint(manifest, slug, event.fingerprint)
          saveMediaManifest(manifest)
        }

        return { imported: false, skippedExisting: false, branchMerged: true, slug }
      }

      return { imported: false, skippedExisting: true, branchMerged: false, slug }
    }

    slug = await findAvailableSlug(payload, event.slug, event.legacyId, reservedSlugs)
  } else {
    slug = await findAvailableSlug(payload, event.slug, event.legacyId, reservedSlugs)
  }

  if (slug !== event.slug) {
    console.log(`  slug: reassigned ${event.slug} -> ${slug}`)
  }

  const data = await buildWhatsOnData(payload, { ...event, slug }, [branchId], manifest)

  await payload.create({
    collection: 'whats-on',
    data,
    overrideAccess: true,
  })

  if (manifest) {
    recordSlugFingerprint(manifest, slug, event.fingerprint)
    saveMediaManifest(manifest)
  }

  return { imported: true, skippedExisting: false, branchMerged: false, slug }
}

async function migrateSingleEventIndex(
  options: MigrationCliOptions,
  legacyIndex: number,
  manifest: MediaUploadManifest,
  payload: import('payload').Payload | null,
  branchCache: Map<string, number | null>,
): Promise<SingleEventMigrationResult> {
  const singleOptions: MigrationCliOptions = {
    ...options,
    indexes: [legacyIndex],
    limit: null,
  }

  const { eligible, mapped } = getMigrationEventBatch(singleOptions)
  const mappedEvent = mapped[0]

  if (!mappedEvent) {
    throw new Error(`Legacy index ${legacyIndex} is out of range`)
  }

  if (eligible.length === 0) {
    const reason = mappedEvent.skippedReason ?? 'Not eligible for migration'
    console.log(`  Skipped: ${reason}`)
    return {
      legacyIndex,
      skipped: true,
      skippedReason: reason,
      title: mappedEvent.title,
      slug: mappedEvent.slug,
    }
  }

  let event = eligible[0]
  const downloadOptions = {
    localAssetsDir: options.localAssetsDir ?? undefined,
  }

  console.log(`  ${event.title}`)
  console.log(`  slug: ${event.slug}`)
  if (event.mediaPath) {
    console.log(`  media: ${legacyPathToUrl(event.mediaPath)}`)
  }
  if (event.galleryPaths.length) {
    console.log(`  gallery: ${event.galleryPaths.length} image(s)`)
  }

  if (event.mediaPath) {
    const bgColor = await extractColorForLegacyPath(
      event.mediaPath,
      event.title,
      manifest,
      downloadOptions,
    )
    if (!bgColor) {
      const error = manifest.entries[event.mediaPath]?.error ?? 'Failed to extract card media color'
      throw new Error(error)
    }
    console.log(`  bgColor: ${bgColor}`)
  }

  const pathToMeta = new Map<string, { alt: string; slug: string; index?: number }>()
  if (event.mediaPath) {
    pathToMeta.set(event.mediaPath, { alt: event.title, slug: event.slug })
  }
  event.galleryPaths.forEach((legacyPath, index) => {
    if (!pathToMeta.has(legacyPath)) {
      pathToMeta.set(legacyPath, { alt: event.title, slug: event.slug, index })
    }
  })

  const cachePaths = listUniqueMigrationImagePaths([event])
  for (const legacyPath of cachePaths) {
    const meta = pathToMeta.get(legacyPath)
    if (!meta) continue
    await ensureManifestImageCached(legacyPath, meta.alt, manifest, downloadOptions)
  }
  saveMediaManifest(manifest)

  const uploadPaths = listUniqueMigrationImagePaths([event], manifest)
  let mediaUploaded = 0
  let mediaCached = 0
  let mediaFailed = 0

  for (const legacyPath of uploadPaths) {
    const meta = pathToMeta.get(legacyPath)
    if (!meta) continue

    await uploadLegacyMediaFile(payload, {
      legacyPath,
      alt: meta.alt,
      slug: meta.slug,
      index: meta.index,
      dryRun: options.dryRun,
      manifest,
      downloadOptions,
    })

    if (options.dryRun) continue

    const entry = manifest.entries[legacyPath]
    if (entry?.status === 'uploaded') mediaUploaded += 1
    if (entry?.status === 'cached') mediaCached += 1
    if (entry?.status === 'failed') mediaFailed += 1
  }

  saveMediaManifest(manifest)

  if (!options.dryRun) {
    console.log(`  media: ${mediaUploaded} uploaded, ${mediaCached} reused, ${mediaFailed} failed`)
    if (mediaFailed > 0) {
      throw new Error(`Media import failed for ${mediaFailed} image(s)`)
    }
  } else {
    console.log(`  media: ${uploadPaths.length} unique image(s) prepared`)
  }

  let imported = false
  let skippedExisting = false
  let branchMerged = false

  if (!options.dryRun) {
    if (!payload) {
      throw new Error('Payload client is required when --write is set')
    }

    const importResult = await importSingleEvent(event, manifest, payload, branchCache)
    if (importResult.error) {
      throw new Error(importResult.error)
    }

    imported = importResult.imported
    skippedExisting = importResult.skippedExisting
    branchMerged = importResult.branchMerged
    if (importResult.slug !== event.slug) {
      event = { ...event, slug: importResult.slug }
    }

    if (branchMerged) {
      console.log(`  event: branch merged (${event.branchSlug} added)`)
    } else if (skippedExisting) {
      console.log('  event: already exists (skipped)')
    } else if (imported) {
      console.log('  event: created')
    }

    if (imported || branchMerged) {
      appendRollbackLog({
        legacyIndex,
        legacyId: event.legacyId,
        slug: event.slug,
        branchSlug: event.branchSlug,
        action: branchMerged ? 'branch_merged' : 'created',
        mediaLegacyPaths: listUniqueMigrationImagePaths([event], manifest),
      })
    }
  } else {
    console.log('  event: dry-run preview OK')
  }

  let cacheCleaned = 0
  if (!options.keepCache) {
    cacheCleaned = cleanupEventMediaCache(manifest, [event])
    if (cacheCleaned > 0) {
      console.log(`  cache: removed ${cacheCleaned} file(s)`)
    }
  }

  return {
    legacyIndex,
    skipped: false,
    title: event.title,
    slug: event.slug,
    mediaUploaded,
    mediaCached,
    mediaFailed,
    imported,
    skippedExisting,
    branchMerged,
    cacheCleaned,
  }
}

export async function runMigrationPipeline(options: MigrationCliOptions) {
  if (options.dryRun) {
    printDryRunBanner()
  }

  console.log('\n=== Analyze ===')
  const analyze = runAnalyzeStep(options)
  if (analyze.eligibleCount === 0) {
    throw new Error('No eligible events to migrate for the selected indexes/limit')
  }

  const indexes = resolveMigrationIndexes(options)
  if (!indexes.length) {
    throw new Error('No eligible legacy indexes to process')
  }

  console.log(`\nProcessing ${indexes.length} index(es) one at a time: ${indexes.join(', ')}`)

  const manifest: MediaUploadManifest = loadMediaManifest() ?? {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    entries: {},
  }

  const payload = options.dryRun
    ? null
    : await import('../../lib/getPayloadLocal.js').then((m) => m.getMigrationPayload())

  if (!options.dryRun && payload) {
    const staleCount = await sanitizeMediaManifest(payload, manifest)
    if (staleCount > 0) {
      console.log(`Manifest: cleared ${staleCount} stale media reference(s)`)
      saveMediaManifest(manifest)
    }
  }

  const branchCache = new Map<string, number | null>()
  const completed: SingleEventMigrationResult[] = []
  const skipped: SingleEventMigrationResult[] = []

  for (const legacyIndex of indexes) {
    console.log(`\n=== Index ${legacyIndex} ===`)

    try {
      const result = await migrateSingleEventIndex(
        options,
        legacyIndex,
        manifest,
        payload,
        branchCache,
      )

      if (result.skipped) {
        skipped.push(result)
      } else {
        completed.push(result)
      }

      writeJsonReport(PROGRESS_REPORT_PATH, {
        generatedAt: new Date().toISOString(),
        dryRun: options.dryRun,
        completedIndexes: completed.map((item) => item.legacyIndex),
        skippedIndexes: skipped.map((item) => ({
          index: item.legacyIndex,
          reason: item.skippedReason,
        })),
        lastProcessedIndex: legacyIndex,
        status: 'in_progress',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`\nStopped at index ${legacyIndex}: ${message}`)

      writeJsonReport(PROGRESS_REPORT_PATH, {
        generatedAt: new Date().toISOString(),
        dryRun: options.dryRun,
        completedIndexes: completed.map((item) => item.legacyIndex),
        skippedIndexes: skipped.map((item) => ({
          index: item.legacyIndex,
          reason: item.skippedReason,
        })),
        failedIndex: legacyIndex,
        error: message,
        resumeHint: `pnpm migrate:events${options.dryRun ? '' : ' --write'} --indexes ${legacyIndex}${options.localAssetsDir ? ` --assets-dir ${options.localAssetsDir}` : ''}`,
        status: 'failed',
      })

      throw error
    }
  }

  writeJsonReport(PROGRESS_REPORT_PATH, {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    completedIndexes: completed.map((item) => item.legacyIndex),
    skippedIndexes: skipped.map((item) => ({
      index: item.legacyIndex,
      reason: item.skippedReason,
    })),
    status: 'complete',
  })

  writeJsonReport(IMPORT_REPORT_PATH, {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    processed: completed.length + skipped.length,
    created: completed.filter((item) => item.imported || options.dryRun).length,
    skippedExisting: completed.filter((item) => item.skippedExisting).length,
    skippedIneligible: skipped.length,
    events: [...completed, ...skipped],
  })

  console.log('\nMigration complete')
  console.log(`Completed: ${completed.length}`)
  console.log(`Skipped:   ${skipped.length}`)
  if (analyze.selectedIndexes) {
    console.log(`Indexes:   ${analyze.selectedIndexes.join(', ')}`)
  }
  console.log(`Reports:   ${REPORTS_DIR}/`)
  if (!options.keepCache && completed.length > 0) {
    console.log('Cache:     cleaned after each index (pass --keep-cache to retain WebP files)')
  }
}
