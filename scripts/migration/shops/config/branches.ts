import { repoPath } from '../../lib/paths.js'
import { REPORTS_DIR } from './constants.js'

export type BranchVendorConfig = {
  slug: string
  branchCode: string
  csvPath: string
  jsonPath: string
  importPreviewPath: string
  floorOrder: string[]
  floorLabels: Record<string, string>
  floorLabelToId: Record<string, string>
  allowedFloorIds: string[]
}

export const SHOP_BRANCH_SLUGS = ['thonglor', 'saladaeng', 'cloud-11'] as const

export type ShopBranchSlug = (typeof SHOP_BRANCH_SLUGS)[number]

export const VENDOR_MEDIA_BRANCH_SLUGS = ['thonglor', 'saladaeng'] as const

export type VendorMediaBranchSlug = (typeof VENDOR_MEDIA_BRANCH_SLUGS)[number]

export const BRANCH_VENDOR_CONFIGS: Record<string, BranchVendorConfig> = {
  thonglor: {
    slug: 'thonglor',
    branchCode: 'TL',
    csvPath: repoPath('legacy-db/vendors-thonglor.csv'),
    jsonPath: repoPath('legacy-db/vendors-thonglor.json'),
    importPreviewPath: `${REPORTS_DIR}/thonglor-vendors-import-preview.json`,
    floorOrder: ['m', '1', '2', '3'],
    floorLabels: {
      m: 'Market (Fl. M)',
      '1': 'Village (Fl. 1)',
      '2': 'Play Yard (Fl. 2)',
      '3': 'Top Yard (Fl. 3)',
      unassigned: 'Unassigned',
    },
    floorLabelToId: {
      'village (fl. 1)': '1',
      'market (fl. m)': 'm',
      'play yard (fl.2)': '2',
      'play yard (fl. 2)': '2',
      'top yard (fl.3)': '3',
      'top yard (fl. 3)': '3',
    },
    allowedFloorIds: ['m', '1', '2', '3'],
  },
  saladaeng: {
    slug: 'saladaeng',
    branchCode: 'SD',
    csvPath: repoPath('legacy-db/vendors-saladaeng.csv'),
    jsonPath: repoPath('legacy-db/vendors-saladaeng.json'),
    importPreviewPath: `${REPORTS_DIR}/saladaeng-vendors-import-preview.json`,
    floorOrder: ['1', '2', '3'],
    floorLabels: {
      '1': 'The Ground (Fl. 1)',
      '2': 'The Market (Fl. 2)',
      '3': 'The Sala (Fl. 3)',
      unassigned: 'Unassigned',
    },
    floorLabelToId: {
      'the ground (fl.1)': '1',
      'the ground (fl. 1)': '1',
      'the market (fl.2)': '2',
      'the market (fl. 2)': '2',
      'the sala (fl.3)': '3',
      'the sala (fl. 3)': '3',
    },
    allowedFloorIds: ['1', '2', '3'],
  },
  'cloud-11': {
    slug: 'cloud-11',
    branchCode: 'CL',
    csvPath: repoPath('legacy-db/vendors-cloud-11.csv'),
    jsonPath: repoPath('legacy-db/vendors-cloud-11.json'),
    importPreviewPath: `${REPORTS_DIR}/cloud-11-vendors-import-preview.json`,
    floorOrder: ['1', '2', '3', '4'],
    floorLabels: {
      '1': 'Ground Work',
      '2': 'Play Yard',
      '3': 'Market',
      '4': 'Grand Stand',
      unassigned: 'Unassigned',
    },
    floorLabelToId: {
      'ground work': '1',
      'play yard': '2',
      market: '3',
      'grand stand': '4',
    },
    allowedFloorIds: ['1', '2', '3', '4'],
  },
}

export function getBranchVendorConfig(branchSlug: string): BranchVendorConfig {
  const config = BRANCH_VENDOR_CONFIGS[branchSlug]
  if (!config) {
    throw new Error(
      `Unknown branch "${branchSlug}". Supported: ${Object.keys(BRANCH_VENDOR_CONFIGS).join(', ')}`,
    )
  }

  return config
}

export function supportsVendorMedia(branchSlug: string): branchSlug is VendorMediaBranchSlug {
  return (VENDOR_MEDIA_BRANCH_SLUGS as readonly string[]).includes(branchSlug)
}

export function resolveShopBranchSlugs(
  argv = process.argv.slice(2).filter((arg) => arg !== '--'),
): ShopBranchSlug[] {
  const branch = parseBranchArg(argv)
  const explicit = argv.includes('--branch')

  if (explicit) {
    getBranchVendorConfig(branch)
    return [branch as ShopBranchSlug]
  }

  return [...SHOP_BRANCH_SLUGS]
}

export function parseBranchArg(argv = process.argv.slice(2).filter((arg) => arg !== '--')): string {
  const index = argv.indexOf('--branch')
  if (index >= 0 && argv[index + 1]) return argv[index + 1]
  return 'thonglor'
}

export function parseReplaceArg(argv = process.argv.slice(2).filter((arg) => arg !== '--')): boolean {
  return argv.includes('--replace')
}

export type ShopsMigrationOptions = {
  replace: boolean
}
