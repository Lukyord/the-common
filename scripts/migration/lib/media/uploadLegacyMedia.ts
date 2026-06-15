import crypto from 'crypto'
import fs from 'fs'

import type { Payload } from 'payload'

import {
  convertLegacyImageToWebp,
  readWebpFile,
  webpFilenameForLegacyPath,
  type MediaConvertContext,
  type MediaDownloadOptions,
} from './convertImageToWebp.js'
import { writeJsonReport } from '../fs.js'

export type MediaUploadManifestEntry = {
  legacyPath: string
  mediaId?: number
  alt: string
  webpPath?: string
  dominantColor?: string
  contentHash?: string
  status: 'dry-run' | 'uploaded' | 'cached' | 'failed' | 'skipped' | 'color-only'
  error?: string
}

export type MediaUploadManifest = {
  generatedAt: string
  dryRun: boolean
  entries: Record<string, MediaUploadManifestEntry>
  slugFingerprints?: Record<string, string>
}

function reuseCachedWebpEntry(
  manifest: MediaUploadManifest,
  legacyPath: string,
  alt: string,
  duplicateEntry: MediaUploadManifestEntry,
  contentHash: string,
  webpPath?: string,
): void {
  manifest.entries[legacyPath] = {
    legacyPath,
    alt,
    webpPath: duplicateEntry.webpPath ?? webpPath,
    dominantColor: duplicateEntry.dominantColor,
    contentHash,
    status: manifest.entries[legacyPath]?.status ?? 'color-only',
  }
}

export function loadMediaManifest(manifestPath: string): MediaUploadManifest | null {
  if (!fs.existsSync(manifestPath)) return null
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as MediaUploadManifest
}

export function saveMediaManifest(manifestPath: string, manifest: MediaUploadManifest) {
  writeJsonReport(manifestPath, manifest)
}

export function hashWebpContent(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

function findManifestEntryByContentHash(
  manifest: MediaUploadManifest,
  contentHash: string,
  excludePath: string,
): MediaUploadManifestEntry | null {
  for (const [path, entry] of Object.entries(manifest.entries)) {
    if (path === excludePath) continue
    if (entry.contentHash === contentHash && entry.mediaId) {
      return entry
    }
  }

  return null
}

function findManifestEntryWithCachedWebp(
  manifest: MediaUploadManifest,
  contentHash: string,
  excludePath: string,
): MediaUploadManifestEntry | null {
  for (const [path, entry] of Object.entries(manifest.entries)) {
    if (path === excludePath) continue
    if (entry.contentHash === contentHash && entry.webpPath && fs.existsSync(entry.webpPath)) {
      return entry
    }
  }

  return null
}

function manifestWebpExists(manifest: MediaUploadManifest, legacyPath: string): boolean {
  const webpPath = manifest.entries[legacyPath]?.webpPath
  return Boolean(webpPath && fs.existsSync(webpPath))
}

export async function mediaIdExists(payload: Payload, mediaId: number): Promise<boolean> {
  try {
    await payload.findByID({
      collection: 'media',
      id: mediaId,
      overrideAccess: true,
    })
    return true
  } catch {
    return false
  }
}

export function purgeMediaIdsFromManifest(
  manifest: MediaUploadManifest,
  mediaIds: Set<number>,
): number {
  let count = 0

  for (const entry of Object.values(manifest.entries)) {
    if (!entry.mediaId || !mediaIds.has(entry.mediaId)) continue
    delete entry.mediaId
    if (entry.status === 'cached' || entry.status === 'uploaded') {
      entry.status = entry.webpPath ? 'color-only' : 'failed'
    }
    count += 1
  }

  return count
}

export async function sanitizeMediaManifest(
  payload: Payload,
  manifest: MediaUploadManifest,
): Promise<number> {
  const staleIds = new Set<number>()
  const checkedIds = new Set<number>()

  for (const entry of Object.values(manifest.entries)) {
    if (!entry.mediaId || checkedIds.has(entry.mediaId)) continue
    checkedIds.add(entry.mediaId)

    if (!(await mediaIdExists(payload, entry.mediaId))) {
      staleIds.add(entry.mediaId)
    }
  }

  return purgeMediaIdsFromManifest(manifest, staleIds)
}

async function tryReuseDuplicateManifestEntry(
  payload: Payload | null,
  manifest: MediaUploadManifest,
  legacyPath: string,
  alt: string,
  duplicateEntry: MediaUploadManifestEntry,
  contentHash: string,
  webpPath?: string,
  validate?: (mediaId: number) => Promise<boolean>,
): Promise<number | null> {
  const mediaId = duplicateEntry.mediaId
  if (!mediaId) return null

  if (payload && !(await mediaIdExists(payload, mediaId))) {
    purgeMediaIdsFromManifest(manifest, new Set([mediaId]))
    return null
  }

  if (validate && !(await validate(mediaId))) {
    purgeMediaIdsFromManifest(manifest, new Set([mediaId]))
    return null
  }

  manifest.entries[legacyPath] = {
    legacyPath,
    alt,
    mediaId,
    webpPath: duplicateEntry.webpPath ?? webpPath,
    dominantColor: duplicateEntry.dominantColor,
    contentHash,
    status: 'cached',
  }
  return mediaId
}

export function recordSlugFingerprint(
  manifest: MediaUploadManifest,
  slug: string,
  fingerprint: string,
): void {
  manifest.slugFingerprints = manifest.slugFingerprints ?? {}
  manifest.slugFingerprints[slug] = fingerprint
}

export async function ensureManifestImageCached(
  legacyPath: string,
  alt: string,
  manifest: MediaUploadManifest,
  mediaContext: MediaConvertContext,
  downloadOptions?: MediaDownloadOptions,
): Promise<void> {
  const entry = manifest.entries[legacyPath]
  if (entry?.contentHash && manifestWebpExists(manifest, legacyPath)) return

  const storedHash = entry?.contentHash
  if (storedHash) {
    const duplicateEntry = findManifestEntryWithCachedWebp(manifest, storedHash, legacyPath)
    if (duplicateEntry) {
      reuseCachedWebpEntry(manifest, legacyPath, alt, duplicateEntry, storedHash)
      return
    }
  }

  try {
    const converted = await convertLegacyImageToWebp(legacyPath, mediaContext, downloadOptions)
    const contentHash = hashWebpContent(readWebpFile(converted.webpPath))
    const duplicateEntry = findManifestEntryWithCachedWebp(manifest, contentHash, legacyPath)

    if (duplicateEntry?.webpPath) {
      if (converted.webpPath !== duplicateEntry.webpPath && fs.existsSync(converted.webpPath)) {
        fs.unlinkSync(converted.webpPath)
      }

      reuseCachedWebpEntry(
        manifest,
        legacyPath,
        alt,
        duplicateEntry,
        contentHash,
        duplicateEntry.webpPath,
      )
      return
    }

    manifest.entries[legacyPath] = {
      ...entry,
      legacyPath,
      alt: entry?.alt ?? alt,
      webpPath: converted.webpPath,
      dominantColor: converted.dominantColor,
      contentHash,
      status: entry?.status ?? 'color-only',
    }
  } catch (error) {
    manifest.entries[legacyPath] = {
      ...entry,
      legacyPath,
      alt: entry?.alt ?? alt,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function uploadLegacyMediaFile(
  payload: Payload | null,
  args: {
    legacyPath: string
    alt: string
    slug: string
    index?: number
    dryRun: boolean
    manifest: MediaUploadManifest
    mediaContext: MediaConvertContext
    downloadOptions?: MediaDownloadOptions
    expectedFilename?: string
    strictMediaReuse?: boolean
  },
): Promise<number | null> {
  const {
    legacyPath,
    alt,
    slug,
    index,
    dryRun,
    manifest,
    mediaContext,
    downloadOptions,
    expectedFilename,
    strictMediaReuse,
  } = args

  async function mediaMatchesMigration(mediaId: number): Promise<boolean> {
    if (!payload || !strictMediaReuse || !expectedFilename) return true

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

  const reuseValidator = strictMediaReuse ? mediaMatchesMigration : undefined

  if (manifest.entries[legacyPath]?.mediaId) {
    getContentHashFromManifest(manifest, legacyPath)

    const storedHash = manifest.entries[legacyPath]?.contentHash
    if (storedHash) {
      const duplicateEntry = findManifestEntryByContentHash(manifest, storedHash, legacyPath)
      if (
        duplicateEntry?.mediaId &&
        duplicateEntry.mediaId !== manifest.entries[legacyPath].mediaId
      ) {
        const reused = await tryReuseDuplicateManifestEntry(
          payload,
          manifest,
          legacyPath,
          alt,
          duplicateEntry,
          storedHash,
          undefined,
          reuseValidator,
        )
        if (reused) return reused
      }
    }

    const existingMediaId = manifest.entries[legacyPath].mediaId!
    if (payload) {
      if (
        (await mediaIdExists(payload, existingMediaId)) &&
        (await mediaMatchesMigration(existingMediaId))
      ) {
        manifest.entries[legacyPath].status = 'cached'
        return existingMediaId
      }

      purgeMediaIdsFromManifest(manifest, new Set([existingMediaId]))
    } else {
      manifest.entries[legacyPath].status = 'cached'
      return existingMediaId
    }
  }

  const storedHash = manifest.entries[legacyPath]?.contentHash
  if (storedHash) {
    const duplicateEntry = findManifestEntryByContentHash(manifest, storedHash, legacyPath)
    if (duplicateEntry?.mediaId) {
      const reused = await tryReuseDuplicateManifestEntry(
        payload,
        manifest,
        legacyPath,
        alt,
        duplicateEntry,
        storedHash,
        undefined,
        reuseValidator,
      )
      if (reused) return reused
    }
  }

  let converted: Awaited<ReturnType<typeof convertLegacyImageToWebp>> | null = null

  if (manifestWebpExists(manifest, legacyPath)) {
    const entry = manifest.entries[legacyPath]
    converted = {
      legacyPath,
      sourceUrl: '',
      webpPath: entry.webpPath!,
      size: 0,
      dominantColor: entry.dominantColor ?? '',
    }
  } else {
    try {
      converted = await convertLegacyImageToWebp(legacyPath, mediaContext, downloadOptions)
    } catch (error) {
      manifest.entries[legacyPath] = {
        legacyPath,
        alt,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      }
      return null
    }
  }

  const webpData = readWebpFile(converted.webpPath)
  const contentHash = hashWebpContent(webpData)
  const duplicateEntry = findManifestEntryByContentHash(manifest, contentHash, legacyPath)

  if (duplicateEntry?.mediaId) {
    const reused = await tryReuseDuplicateManifestEntry(
      payload,
      manifest,
      legacyPath,
      alt,
      duplicateEntry,
      contentHash,
      duplicateEntry.webpPath ?? converted.webpPath,
      reuseValidator,
    )

    if (reused) {
      if (converted.webpPath !== duplicateEntry.webpPath && fs.existsSync(converted.webpPath)) {
        fs.unlinkSync(converted.webpPath)
      }
      return reused
    }
  }

  if (dryRun) {
    manifest.entries[legacyPath] = {
      legacyPath,
      alt,
      webpPath: converted.webpPath,
      dominantColor: converted.dominantColor,
      contentHash,
      status: 'dry-run',
    }
    return null
  }

  if (!payload) {
    throw new Error('Payload client is required when --write is set')
  }

  try {
    const filename = webpFilenameForLegacyPath(legacyPath, slug, index)

    const media = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: webpData,
        mimetype: 'image/webp',
        name: filename,
        size: webpData.length,
      },
      overrideAccess: true,
    })

    manifest.entries[legacyPath] = {
      legacyPath,
      mediaId: media.id,
      alt,
      webpPath: converted.webpPath,
      dominantColor: converted.dominantColor,
      contentHash,
      status: 'uploaded',
    }

    return media.id
  } catch (error) {
    manifest.entries[legacyPath] = {
      legacyPath,
      alt,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    }
    return null
  }
}

export function getMediaIdFromManifest(manifest: MediaUploadManifest, legacyPath: string | null) {
  if (!legacyPath) return null
  return manifest.entries[legacyPath]?.mediaId ?? null
}

export async function getValidatedMediaIdFromManifest(
  payload: Payload,
  manifest: MediaUploadManifest,
  legacyPath: string | null,
): Promise<number | null> {
  const mediaId = getMediaIdFromManifest(manifest, legacyPath)
  if (!mediaId) return null

  if (await mediaIdExists(payload, mediaId)) {
    return mediaId
  }

  purgeMediaIdsFromManifest(manifest, new Set([mediaId]))
  return null
}

export function getDominantColorFromManifest(
  manifest: MediaUploadManifest,
  legacyPath: string | null,
): string | null {
  if (!legacyPath) return null
  return manifest.entries[legacyPath]?.dominantColor ?? null
}

export function getContentHashFromManifest(
  manifest: MediaUploadManifest,
  legacyPath: string | null,
): string | null {
  if (!legacyPath) return null

  const entry = manifest.entries[legacyPath]
  if (!entry) return null
  if (entry.contentHash) return entry.contentHash
  if (!entry.webpPath) return null

  try {
    entry.contentHash = hashWebpContent(readWebpFile(entry.webpPath))
    return entry.contentHash
  } catch {
    return null
  }
}

export async function extractColorForLegacyPath(
  legacyPath: string,
  alt: string,
  manifest: MediaUploadManifest,
  mediaContext: MediaConvertContext,
  downloadOptions?: MediaDownloadOptions,
): Promise<string | null> {
  try {
    const converted = await convertLegacyImageToWebp(legacyPath, mediaContext, downloadOptions)
    const contentHash = hashWebpContent(readWebpFile(converted.webpPath))
    manifest.entries[legacyPath] = {
      ...manifest.entries[legacyPath],
      legacyPath,
      alt,
      webpPath: converted.webpPath,
      dominantColor: converted.dominantColor,
      contentHash,
      status: manifest.entries[legacyPath]?.status ?? 'color-only',
    }
    return converted.dominantColor
  } catch (error) {
    manifest.entries[legacyPath] = {
      ...manifest.entries[legacyPath],
      legacyPath,
      alt,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
    }
    return null
  }
}
