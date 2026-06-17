import type { Branch } from '@/payload-types'

import type { CardBranchDotItem } from './types'

function toCardBranchDotItem(branch: number | Branch | null | undefined): CardBranchDotItem | null {
  if (!branch || typeof branch === 'number' || !branch.slug) return null

  return {
    slug: branch.slug,
    name: branch.name,
    bgColor: branch.bgColor ?? null,
    primaryColor: branch.primaryColor ?? null,
    footerBgColor: branch.footerBg ?? null,
  }
}

export function normalizeCardBranches(
  branches?: (number | Branch)[] | number | Branch | null,
): CardBranchDotItem[] {
  if (!branches) return []

  const list = Array.isArray(branches) ? branches : [branches]

  return list.flatMap((branch) => {
    const item = toCardBranchDotItem(branch)
    return item ? [item] : []
  })
}
