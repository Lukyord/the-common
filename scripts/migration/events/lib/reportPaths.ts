import path from 'path'

import { REPORTS_DIR } from '../config/constants.js'

export const ANALYSIS_REPORT_PATH = path.join(REPORTS_DIR, 'events-analysis.json')
export const IMPORT_REPORT_PATH = path.join(REPORTS_DIR, 'events-import-preview.json')
export const PROGRESS_REPORT_PATH = path.join(REPORTS_DIR, 'migration-progress.json')
export const ROLLBACK_LOG_PATH = path.join(REPORTS_DIR, 'rollback-log.json')
export const EVENTS_MAPPED_REPORT_PATH = path.join(REPORTS_DIR, 'events-mapped.json')
