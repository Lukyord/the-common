import { repoPath } from '../../lib/paths.js'
import { REPORTS_DIR } from './constants.js'

export const LEGACY_SHOPS_PATH = repoPath('legacy-db/the-commons-cloud.shops.json')
export const VENDOR_MEDIA_CACHE_DIR = repoPath('scripts/migration/shops/cache/media')
export const VENDOR_MEDIA_MANIFEST_PATH = `${REPORTS_DIR}/vendor-media-manifest.json`
export const VENDOR_MEDIA_MANIFEST_PROD_PATH = `${REPORTS_DIR}/vendor-media-manifest.prod.json`
export const VENDOR_MEDIA_IMPORT_PREVIEW_PATH = `${REPORTS_DIR}/vendor-media-import-preview.json`

export const LEGACY_S3_BASE_URL = 'https://s3-ap-southeast-1.amazonaws.com/thecommonsbkk'
export const VENDOR_GALLERY_MAX = 5
export const VENDOR_WEBP_QUALITY = 82
