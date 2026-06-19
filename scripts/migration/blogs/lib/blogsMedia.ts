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
export const recordContentFingerprint = media.recordContentFingerprint
export const getContentFingerprintFromManifest = media.getContentFingerprintFromManifest
export const getMediaIdFromManifest = media.getMediaIdFromManifest
export const getContentHashFromManifest = media.getContentHashFromManifest
export const sanitizeMediaManifest = media.sanitizeMediaManifest
export const purgeMediaIdsFromManifest = media.purgeMediaIdsFromManifest

export const getValidatedMediaIdFromManifest = media.getValidatedMediaIdFromManifest

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
