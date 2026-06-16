import type { Vendor } from '@/payload-types'

import type { MigrationCliOptions } from '../../lib/cli.js'
import { ensureDir, writeJsonReport } from '../../lib/fs.js'
import { getMigrationPayload, resolveBranchId } from '../../lib/getPayloadLocal.js'
import {
  LEGACY_S3_BASE_URL,
  VENDOR_GALLERY_MAX,
  VENDOR_MEDIA_IMPORT_PREVIEW_PATH,
} from '../config/media.js'
import type { BranchVendorConfig } from '../config/branches.js'
import {
  buildLegacyShopIndex,
  findLegacyShop,
  getLegacyShopGalleryUrls,
  loadLegacyShops,
} from './loadLegacyShops.js'
import {
  loadVendorMediaManifest,
  saveVendorMediaManifest,
  sanitizeMediaManifest,
  uploadLegacyMediaFile,
  vendorMediaContext,
} from './shopsMedia.js'
import {
  galleryManifestKey,
  localCoverManifestKey,
  uploadLocalWebpMedia,
  urlToLegacyShopPath,
  vendorCoverFilename,
  vendorGalleryFilename,
} from './uploadVendorMedia.js'
import { buildVendorCoverIndex, findVendorCoverPath } from './vendorCoverIndex.js'

type VendorMediaPreviewRow = {
  vendorId: number
  name: string
  slug: string
  action: 'update' | 'skip'
  reason?: string
  coverFile?: string | null
  galleryCount: number
  warnings: string[]
}

function supportsVendorCovers(branchSlug: string): branchSlug is 'thonglor' | 'saladaeng' {
  return branchSlug === 'thonglor' || branchSlug === 'saladaeng'
}

export async function runVendorMediaPipeline(
  options: MigrationCliOptions,
  config: BranchVendorConfig,
) {
  if (!supportsVendorCovers(config.slug)) {
    return
  }

  ensureDir(vendorMediaContext.cacheDir)

  const payload = await getMigrationPayload()
  const branchId = await resolveBranchId(payload, config.slug)
  if (!branchId) {
    throw new Error(`${config.slug} branch not found in D1`)
  }

  let manifest = loadVendorMediaManifest(options.remote) ?? {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    entries: {},
  }

  if (!options.dryRun) {
    await sanitizeMediaManifest(payload, manifest)
  }

  const coverIndex = buildVendorCoverIndex(config.slug)
  const legacyShopIndex = buildLegacyShopIndex(loadLegacyShops())

  const { docs: vendors } = await payload.find({
    collection: 'vendors',
    where: { branch: { equals: branchId } },
    limit: 500,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  const preview: VendorMediaPreviewRow[] = []
  let updated = 0
  let skipped = 0

  console.log(`Processing ${vendors.length} vendor(s) for ${config.slug}`)
  console.log('')

  for (const vendor of vendors) {
    const warnings: string[] = []
    const coverPath = findVendorCoverPath(coverIndex, vendor.name)
    const legacyShop = findLegacyShop(legacyShopIndex, config.slug, vendor.name, vendor.slug)
    const galleryUrls = (legacyShop ? getLegacyShopGalleryUrls(legacyShop) : []).slice(
      0,
      VENDOR_GALLERY_MAX,
    )

    if (!coverPath) {
      warnings.push('Cover image not found')
    }

    if (!legacyShop) {
      warnings.push('Legacy shop not found for gallery')
    } else if (!galleryUrls.length) {
      warnings.push('Legacy shop has no gallery images')
    }

    if (!coverPath && !galleryUrls.length) {
      skipped += 1
      preview.push({
        vendorId: vendor.id,
        name: vendor.name,
        slug: vendor.slug,
        action: 'skip',
        reason: 'No cover or gallery sources',
        coverFile: null,
        galleryCount: 0,
        warnings,
      })
      continue
    }

    let mediaId: number | null = null
    if (coverPath) {
      mediaId = await uploadLocalWebpMedia(options.dryRun ? null : payload, {
        manifestKey: localCoverManifestKey(config.slug, vendor.slug),
        filePath: coverPath,
        alt: vendor.name,
        slug: vendor.slug,
        dryRun: options.dryRun,
        manifest,
        expectedFilename: vendorCoverFilename(vendor.slug),
        strictMediaReuse: options.remote,
      })
    }

    const galleryIds: number[] = []

    for (let index = 0; index < galleryUrls.length; index += 1) {
      const url = galleryUrls[index]
      const legacyPath = urlToLegacyShopPath(url)
      const galleryId = await uploadLegacyMediaFile(options.dryRun ? null : payload, {
        legacyPath: galleryManifestKey(legacyPath),
        alt: vendor.name,
        slug: vendor.slug,
        index,
        dryRun: options.dryRun,
        manifest,
        expectedFilename: vendorGalleryFilename(vendor.slug, index),
        strictMediaReuse: options.remote,
      })

      if (galleryId) galleryIds.push(galleryId)
    }

    if (!options.dryRun) {
      const updateData: Partial<Vendor> = {}
      if (mediaId) updateData.media = mediaId
      if (galleryIds.length) updateData.gallery = galleryIds

      if (Object.keys(updateData).length) {
        await payload.update({
          collection: 'vendors',
          id: vendor.id,
          data: updateData,
          overrideAccess: true,
        })
        updated += 1
        console.log(
          `Updated: ${vendor.name} (${vendor.slug}) — cover: ${mediaId ? 'yes' : 'no'}, gallery: ${galleryIds.length}`,
        )
      } else {
        skipped += 1
        warnings.push('No media uploaded')
      }
    } else {
      updated += 1
      console.log(
        `Would update: ${vendor.name} (${vendor.slug}) — cover: ${coverPath ? 'yes' : 'no'}, gallery: ${galleryUrls.length}`,
      )
    }

    preview.push({
      vendorId: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      action: 'update',
      coverFile: coverPath,
      galleryCount: galleryIds.length || galleryUrls.length,
      warnings,
    })
  }

  manifest.generatedAt = new Date().toISOString()
  manifest.dryRun = options.dryRun
  saveVendorMediaManifest(manifest, options.remote)

  writeJsonReport(VENDOR_MEDIA_IMPORT_PREVIEW_PATH, {
    generatedAt: new Date().toISOString(),
    branch: config.slug,
    dryRun: options.dryRun,
    legacyShopsSource: LEGACY_S3_BASE_URL,
    totals: {
      vendors: vendors.length,
      updated,
      skipped,
    },
    rows: preview,
  })

  console.log('')
  console.log(`Branch:           ${config.slug}`)
  console.log(`Vendors:          ${vendors.length}`)
  console.log(`Updated:          ${updated}`)
  console.log(`Skipped:          ${skipped}`)
  console.log(`Preview report:   ${VENDOR_MEDIA_IMPORT_PREVIEW_PATH}`)
}
