import fs from 'fs'
import path from 'path'

import type { Payload } from 'payload'

import {
  hashWebpContent,
  mediaIdExists,
  type MediaUploadManifest,
} from '../../lib/media/uploadLegacyMedia.js'
import { readWebpFile } from '../../lib/media/convertImageToWebp.js'

export function urlToLegacyShopPath(url: string): string {
  try {
    const { pathname } = new URL(url)
    const shopsIndex = pathname.indexOf('/shops/')
    if (shopsIndex >= 0) {
      return pathname.slice(shopsIndex + 1)
    }
  } catch {
    // fall through
  }

  return url
}

export function vendorCoverFilename(slug: string): string {
  return `vendor-${slug}.webp`
}

export function vendorGalleryFilename(slug: string, index: number): string {
  return `vendor-${slug}-gallery-${index + 1}.webp`
}

async function mediaMatchesExpectedFilename(
  payload: Payload,
  mediaId: number,
  expectedFilename: string,
): Promise<boolean> {
  try {
    const doc = await payload.findByID({
      collection: 'media',
      id: mediaId,
      overrideAccess: true,
    })

    return doc.filename === expectedFilename && Boolean(doc.url)
  } catch {
    return false
  }
}

export async function uploadLocalWebpMedia(
  payload: Payload | null,
  args: {
    manifestKey: string
    filePath: string
    alt: string
    slug: string
    dryRun: boolean
    manifest: MediaUploadManifest
    expectedFilename: string
    strictMediaReuse?: boolean
  },
): Promise<number | null> {
  const { manifestKey, filePath, alt, dryRun, manifest, expectedFilename, strictMediaReuse } = args

  const existing = manifest.entries[manifestKey]
  if (existing?.mediaId && payload) {
    const valid =
      !strictMediaReuse ||
      (await mediaMatchesExpectedFilename(payload, existing.mediaId, expectedFilename))

    if (valid && (await mediaIdExists(payload, existing.mediaId))) {
      manifest.entries[manifestKey].status = 'cached'
      return existing.mediaId
    }

    delete manifest.entries[manifestKey].mediaId
  } else if (existing?.mediaId && !payload) {
    manifest.entries[manifestKey].status = 'cached'
    return existing.mediaId
  }

  if (!fs.existsSync(filePath)) {
    manifest.entries[manifestKey] = {
      legacyPath: manifestKey,
      alt,
      status: 'failed',
      error: `File not found: ${filePath}`,
    }
    return null
  }

  const webpData = readWebpFile(filePath)
  const contentHash = hashWebpContent(webpData)

  if (dryRun) {
    manifest.entries[manifestKey] = {
      legacyPath: manifestKey,
      alt,
      webpPath: filePath,
      contentHash,
      status: 'dry-run',
    }
    return null
  }

  if (!payload) {
    throw new Error('Payload client is required when --write is set')
  }

  try {
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: webpData,
        mimetype: 'image/webp',
        name: expectedFilename,
        size: webpData.length,
      },
      overrideAccess: true,
    })

    manifest.entries[manifestKey] = {
      legacyPath: manifestKey,
      mediaId: media.id,
      alt,
      webpPath: filePath,
      contentHash,
      status: 'uploaded',
    }

    return media.id
  } catch (error) {
    manifest.entries[manifestKey] = {
      legacyPath: manifestKey,
      alt,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    }
    return null
  }
}

export function localCoverManifestKey(branchSlug: string, vendorSlug: string): string {
  return `cover:${branchSlug}:${vendorSlug}`
}

export function galleryManifestKey(legacyPath: string): string {
  return legacyPath
}

export function isVendorMediaFilename(filename: string | null | undefined): boolean {
  if (!filename) return false
  const base = path.basename(filename)
  if (base.startsWith('vendor-') && base.endsWith('.webp')) return true
  return /-(thonglor|saladaeng|cloud-11)(-gallery-\d+)?\.webp$/i.test(base)
}
