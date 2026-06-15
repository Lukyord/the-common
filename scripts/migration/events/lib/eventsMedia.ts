import {
  LEGACY_S3_BASE_URL,
  MEDIA_CACHE_DIR,
  MEDIA_MANIFEST_PATH,
  WEBP_QUALITY,
} from '../config/constants.js'
import type { MediaConvertContext, MediaDownloadOptions } from '../../lib/media/convertImageToWebp.js'
import * as media from '../../lib/media/uploadLegacyMedia.js'

export type MediaUploadManifest = media.MediaUploadManifest
export type MediaUploadManifestEntry = media.MediaUploadManifestEntry

export const eventsMediaContext: MediaConvertContext = {
  cacheDir: MEDIA_CACHE_DIR,
  webpQuality: WEBP_QUALITY,
  s3BaseUrl: LEGACY_S3_BASE_URL,
}

export const loadMediaManifest = () => media.loadMediaManifest(MEDIA_MANIFEST_PATH)

export const saveMediaManifest = (manifest: MediaUploadManifest) =>
  media.saveMediaManifest(MEDIA_MANIFEST_PATH, manifest)

export const recordSlugFingerprint = media.recordSlugFingerprint
export const getDominantColorFromManifest = media.getDominantColorFromManifest
export const getMediaIdFromManifest = media.getMediaIdFromManifest
export const getContentHashFromManifest = media.getContentHashFromManifest
export const getValidatedMediaIdFromManifest = media.getValidatedMediaIdFromManifest
export const sanitizeMediaManifest = media.sanitizeMediaManifest
export const purgeMediaIdsFromManifest = media.purgeMediaIdsFromManifest

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
    eventsMediaContext,
    downloadOptions,
  )
}

export async function uploadLegacyMediaFile(
  payload: Parameters<typeof media.uploadLegacyMediaFile>[0],
  args: Omit<Parameters<typeof media.uploadLegacyMediaFile>[1], 'mediaContext'>,
) {
  return media.uploadLegacyMediaFile(payload, { ...args, mediaContext: eventsMediaContext })
}

export async function extractColorForLegacyPath(
  legacyPath: string,
  alt: string,
  manifest: MediaUploadManifest,
  downloadOptions?: MediaDownloadOptions,
) {
  return media.extractColorForLegacyPath(
    legacyPath,
    alt,
    manifest,
    eventsMediaContext,
    downloadOptions,
  )
}
