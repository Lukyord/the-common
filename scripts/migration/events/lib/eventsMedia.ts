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

export const eventsMediaContext: MediaConvertContext = {
  cacheDir: MEDIA_CACHE_DIR,
  webpQuality: WEBP_QUALITY,
  s3BaseUrl: LEGACY_S3_BASE_URL,
}

export function getEventsManifestPath(remote: boolean): string {
  return remote ? MEDIA_MANIFEST_PROD_PATH : MEDIA_MANIFEST_PATH
}

export const loadMediaManifest = (remote = false) =>
  media.loadMediaManifest(getEventsManifestPath(remote))

export const saveMediaManifest = (manifest: MediaUploadManifest, remote = false) =>
  media.saveMediaManifest(getEventsManifestPath(remote), manifest)

export const recordSlugFingerprint = media.recordSlugFingerprint
export const getDominantColorFromManifest = media.getDominantColorFromManifest
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
    eventsMediaContext,
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
