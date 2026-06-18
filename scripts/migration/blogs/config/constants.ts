import path from 'path'

import { repoPath, schemaPath } from '../../lib/paths.js'

export const LEGACY_BLOGS_PATH = repoPath('legacy-db/the-commons-cloud.blogs.json')

export const REPORTS_DIR = schemaPath('blogs/reports')

export const MEDIA_CACHE_DIR = schemaPath('blogs/cache/media')

export const MEDIA_MANIFEST_PATH = path.join(REPORTS_DIR, 'media-manifest.json')

export const LEGACY_S3_BASE_URL = 'https://s3-ap-southeast-1.amazonaws.com/thecommonsbkk'

export const GALLERY_MAX = 5

export const WEBP_QUALITY = 82
