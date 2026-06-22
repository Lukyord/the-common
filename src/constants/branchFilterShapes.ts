export type BranchFilterShape = {
  default: string
  active: string
}

export const BRANCH_FILTER_SHAPES: Record<string, BranchFilterShape> = {
  all: {
    default: '/shapes/all-branch-default.svg',
    active: '/shapes/all-branch-active.svg',
  },
  thonglor: {
    default: '/shapes/tl-default.svg',
    active: '/shapes/tl-active.svg',
  },
  saladaeng: {
    default: '/shapes/sl-default.svg',
    active: '/shapes/sl-active.svg',
  },
  'cloud-11': {
    default: '/shapes/c11-default.svg',
    active: '/shapes/c11-active.svg',
  },
}

export const ALL_BRANCH_FILTER_SLUG = 'all'

export function getBranchFilterShape(slug: string): BranchFilterShape | null {
  return BRANCH_FILTER_SHAPES[slug] ?? null
}
