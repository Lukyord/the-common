import {
  LEGACY_S3_BASE_URL,
  VENDOR_MEDIA_CACHE_DIR,
  VENDOR_MEDIA_MANIFEST_PATH,
  VENDOR_MEDIA_MANIFEST_PROD_PATH,
  VENDOR_WEBP_QUALITY,
} from '../config/media.js'
import type {
  MediaConvertContext,
  MediaDownloadOptions,
} from '../../lib/media/convertImageToWebp.js'
import * as media from '../../lib/media/uploadLegacyMedia.js'

export type MediaUploadManifest = media.MediaUploadManifest

export const vendorMediaContext: MediaConvertContext = {
  cacheDir: VENDOR_MEDIA_CACHE_DIR,
  webpQuality: VENDOR_WEBP_QUALITY,
  s3BaseUrl: LEGACY_S3_BASE_URL,
}

export function getVendorManifestPath(remote: boolean): string {
  return remote ? VENDOR_MEDIA_MANIFEST_PROD_PATH : VENDOR_MEDIA_MANIFEST_PATH
}

export const loadVendorMediaManifest = (remote = false) =>
  media.loadMediaManifest(getVendorManifestPath(remote))

export const saveVendorMediaManifest = (manifest: MediaUploadManifest, remote = false) =>
  media.saveMediaManifest(getVendorManifestPath(remote), manifest)

export const sanitizeMediaManifest = media.sanitizeMediaManifest
export const purgeMediaIdsFromManifest = media.purgeMediaIdsFromManifest
export const mediaIdExists = media.mediaIdExists

export async function uploadLegacyMediaFile(
  payload: Parameters<typeof media.uploadLegacyMediaFile>[0],
  args: Omit<Parameters<typeof media.uploadLegacyMediaFile>[1], 'mediaContext'> & {
    expectedFilename?: string
    strictMediaReuse?: boolean
  },
) {
  return media.uploadLegacyMediaFile(payload, { ...args, mediaContext: vendorMediaContext })
}

export type VendorMediaDownloadOptions = MediaDownloadOptions

export function resetVendorMediaManifest(remote = false) {
  saveVendorMediaManifest(
    {
      generatedAt: new Date().toISOString(),
      dryRun: false,
      entries: {},
    },
    remote,
  )
}
