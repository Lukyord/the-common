import { repoPath } from '../../lib/paths.js'

export const THONGLOR_VENDORS_CSV_PATH = repoPath('legacy-db/thonglor-vendors.csv')
export const REPORTS_DIR = repoPath('scripts/migration/shops/reports')
export const IMPORT_PREVIEW_PATH = `${REPORTS_DIR}/vendors-import-preview.json`

export const BRANCH_CODE_TO_SLUG: Record<string, string> = {
  TL: 'thonglor',
}
