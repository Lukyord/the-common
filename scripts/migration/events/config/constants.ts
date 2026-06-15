import path from 'path'

import { MIGRATION_YEARS } from '../../lib/constants.js'
import { repoPath, schemaPath } from '../../lib/paths.js'

export { MIGRATION_YEARS }

export const LEGACY_EVENTS_PATH = repoPath('legacy-db/the-commons-cloud.events.json')

export const REPORTS_DIR = schemaPath('events/reports')

export const MEDIA_CACHE_DIR = schemaPath('events/cache/media')

export const MEDIA_MANIFEST_PATH = path.join(REPORTS_DIR, 'media-manifest.json')

export const LEGACY_S3_BASE_URL = 'https://s3-ap-southeast-1.amazonaws.com/thecommonsbkk'

export const GALLERY_MAX = 5

export const WEBP_QUALITY = 82

export const MAIN_TAG_PRIORITY = [
  'Workshop',
  'Community Fun',
  'Signature Event',
  'theWHOLESOME Club',
] as const
