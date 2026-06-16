import type { Vendor } from '@/payload-types'
import type { Payload } from 'payload'

import type { MigrationCliOptions } from '../../lib/cli.js'
import { printDryRunBanner } from '../../lib/cli.js'
import { writeJsonReport } from '../../lib/fs.js'
import { getMigrationPayload } from '../../lib/getPayloadLocal.js'
import { VENDOR_MEDIA_IMPORT_PREVIEW_PATH } from '../config/media.js'
import {
  mediaIdExists,
  resetVendorMediaManifest,
} from './shopsMedia.js'
import { isVendorMediaFilename } from './uploadVendorMedia.js'

type CleanupPreviewRow = {
  vendorId: number
  vendorSlug: string
  clearedMediaIds: number[]
  deletedMediaIds: number[]
  keptMediaIds: number[]
}

function getRelationId(value: unknown): number | null {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

function collectVendorMediaIds(vendor: Vendor): number[] {
  const ids = new Set<number>()
  const mediaId = getRelationId(vendor.media)
  if (mediaId) ids.add(mediaId)

  for (const entry of vendor.gallery ?? []) {
    const galleryId = getRelationId(entry)
    if (galleryId) ids.add(galleryId)
  }

  return [...ids]
}

async function isMediaReferencedByWhatsOn(payload: Payload, mediaId: number): Promise<boolean> {
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
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  return docs.some((doc) =>
    (Array.isArray(doc.gallery) ? doc.gallery : [])
      .map((entry) => getRelationId(entry))
      .filter((id): id is number => id != null)
      .includes(mediaId),
  )
}

export async function runVendorMediaCleanup(options: MigrationCliOptions) {
  if (options.dryRun) printDryRunBanner()

  const payload = await getMigrationPayload()
  const { docs: vendors } = await payload.find({
    collection: 'vendors',
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  const preview: CleanupPreviewRow[] = []
  const allMediaIds = new Set<number>()

  for (const vendor of vendors) {
    for (const mediaId of collectVendorMediaIds(vendor)) {
      allMediaIds.add(mediaId)
    }
  }

  console.log(`Clearing media from ${vendors.length} vendor(s)`)
  console.log(`Found ${allMediaIds.size} linked media file(s)`)
  console.log('')

  for (const vendor of vendors) {
    const mediaIds = collectVendorMediaIds(vendor)
    if (!mediaIds.length) continue

    if (!options.dryRun) {
      await payload.update({
        collection: 'vendors',
        id: vendor.id,
        data: { media: null, gallery: [] },
        overrideAccess: true,
      })
    }

    preview.push({
      vendorId: vendor.id,
      vendorSlug: vendor.slug,
      clearedMediaIds: mediaIds,
      deletedMediaIds: [],
      keptMediaIds: [],
    })

    console.log(
      options.dryRun
        ? `Would clear media: ${vendor.name} (${vendor.slug}) — ${mediaIds.length} file(s)`
        : `Cleared media: ${vendor.name} (${vendor.slug}) — ${mediaIds.length} file(s)`,
    )
  }

  const deletedMediaIds = new Set<number>()
  const keptMediaIds = new Set<number>()

  for (const mediaId of allMediaIds) {
    if (await isMediaReferencedByWhatsOn(payload, mediaId)) {
      keptMediaIds.add(mediaId)
      console.log(`Keeping media ${mediaId} (still used by what's-on)`)
      continue
    }

    let filename: string | null = null
    if (await mediaIdExists(payload, mediaId)) {
      const doc = await payload.findByID({
        collection: 'media',
        id: mediaId,
        overrideAccess: true,
      })
      filename = doc.filename ?? null
    }

    if (!isVendorMediaFilename(filename)) {
      keptMediaIds.add(mediaId)
      console.log(`Keeping media ${mediaId} (${filename ?? 'missing'} — not vendor-owned)`)
      continue
    }

    if (!options.dryRun) {
      await payload.delete({
        collection: 'media',
        id: mediaId,
        overrideAccess: true,
      })
    }

    deletedMediaIds.add(mediaId)
    console.log(
      options.dryRun
        ? `Would delete media ${mediaId} (${filename})`
        : `Deleted media ${mediaId} (${filename})`,
    )
  }

  for (const row of preview) {
    row.deletedMediaIds = row.clearedMediaIds.filter((id) => deletedMediaIds.has(id))
    row.keptMediaIds = row.clearedMediaIds.filter((id) => keptMediaIds.has(id))
  }

  if (!options.dryRun) {
    resetVendorMediaManifest(options.remote)
  }

  writeJsonReport(VENDOR_MEDIA_IMPORT_PREVIEW_PATH, {
    generatedAt: new Date().toISOString(),
    action: 'cleanup-vendor-media',
    dryRun: options.dryRun,
    remote: options.remote,
    totals: {
      vendors: vendors.length,
      clearedVendors: preview.length,
      linkedMedia: allMediaIds.size,
      deletedMedia: deletedMediaIds.size,
      keptMedia: keptMediaIds.size,
    },
    rows: preview,
  })

  console.log('')
  console.log(`Vendors cleared:  ${preview.length}`)
  console.log(`Media deleted:    ${deletedMediaIds.size}`)
  console.log(`Media kept:       ${keptMediaIds.size}`)
  console.log(
    `Manifest reset:   ${options.remote ? 'vendor-media-manifest.prod.json' : 'vendor-media-manifest.json'}`,
  )
}
