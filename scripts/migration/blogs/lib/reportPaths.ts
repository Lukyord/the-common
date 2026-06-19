import path from 'path'

import { REPORTS_DIR } from '../config/constants.js'

export const ANALYSIS_REPORT_PATH = path.join(REPORTS_DIR, 'blogs-analysis.json')
export const IMPORT_REPORT_PATH = path.join(REPORTS_DIR, 'blogs-import-preview.json')
export const PROGRESS_REPORT_PATH = path.join(REPORTS_DIR, 'migration-progress.json')
export const BLOGS_MAPPED_REPORT_PATH = path.join(REPORTS_DIR, 'blogs-mapped.json')
export const ROLLBACK_LOG_PATH = path.join(REPORTS_DIR, 'rollback-log.json')
export const MEDIA_MANIFEST_PROD_PATH = path.join(REPORTS_DIR, 'media-manifest.prod.json')
