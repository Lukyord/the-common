import {
  LEGACY_S3_BASE_URL,
  MEDIA_CACHE_DIR,
  MEDIA_MANIFEST_PATH,
  WEBP_QUALITY,
} from '../config/constants.js'
import type {
  MediaConvertContext,
  MediaDownloadOptions,
} from '../../lib/media/convertImageToWebp.js'
import * as media from '../../lib/media/uploadLegacyMedia.js'
import { MEDIA_MANIFEST_PROD_PATH } from './reportPaths.js'

export type MediaUploadManifest = media.MediaUploadManifest
export type MediaUploadManifestEntry = media.MediaUploadManifestEntry

export const blogsMediaContext: MediaConvertContext = {
  cacheDir: MEDIA_CACHE_DIR,
  webpQuality: WEBP_QUALITY,
  s3BaseUrl: LEGACY_S3_BASE_URL,
}

export function getBlogsManifestPath(remote: boolean): string {
  return remote ? MEDIA_MANIFEST_PROD_PATH : MEDIA_MANIFEST_PATH
}

export const loadMediaManifest = (remote = false) =>
  media.loadMediaManifest(getBlogsManifestPath(remote))

export const saveMediaManifest = (manifest: MediaUploadManifest, remote = false) =>
  media.saveMediaManifest(getBlogsManifestPath(remote), manifest)

export const recordSlugFingerprint = media.recordSlugFingerprint
export const getMediaIdFromManifest = media.getMediaIdFromManifest
export const getContentHashFromManifest = media.getContentHashFromManifest
export const sanitizeMediaManifest = media.sanitizeMediaManifest

export async function getValidatedMediaIdFromManifest(
  payload: Parameters<typeof media.getValidatedMediaIdFromManifest>[0],
  manifest: MediaUploadManifest,
  legacyPath: string | null,
  expectedFilename?: string | null,
) {
  const mediaId = media.getMediaIdFromManifest(manifest, legacyPath)
  if (!mediaId) return null

  if (!(await media.mediaIdExists(payload, mediaId))) {
    media.purgeMediaIdsFromManifest(manifest, new Set([mediaId]))
    return null
  }

  if (expectedFilename) {
    const doc = await payload.findByID({
      collection: 'media',
      id: mediaId,
      overrideAccess: true,
    })

    if (doc.filename !== expectedFilename || !doc.url) {
      media.purgeMediaIdsFromManifest(manifest, new Set([mediaId]))
      return null
    }
  }

  return mediaId
}

export async function ensureManifestImageCached(
  legacyPath: string,
  alt: string,
  manifest: MediaUploadManifest,
  downloadOptions?: MediaDownloadOptions,
) {
  return media.ensureManifestImageCached(
    legacyPath,
    alt,
    manifest,
    blogsMediaContext,
    downloadOptions,
  )
}

export async function uploadLegacyMediaFile(
  payload: Parameters<typeof media.uploadLegacyMediaFile>[0],
  args: Omit<Parameters<typeof media.uploadLegacyMediaFile>[1], 'mediaContext'> & {
    expectedFilename?: string
    strictMediaReuse?: boolean
  },
) {
  return media.uploadLegacyMediaFile(payload, { ...args, mediaContext: blogsMediaContext })
}
