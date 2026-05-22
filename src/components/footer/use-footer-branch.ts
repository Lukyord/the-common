'use client'

import { usePathname } from 'next/navigation'

import { branchFooterThemeStyle } from '@/lib/branchTheme'
import { getSlugFromPathname } from '@/lib/pathname'
import type { FooterBranchItem } from './footer-types'

export function useFooterBranch(branches: FooterBranchItem[]) {
  const slug = getSlugFromPathname(usePathname())
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const otherBranches = currentBranch
    ? branches.filter((branch) => branch.id !== currentBranch.id)
    : branches

  return {
    currentBranch,
    otherBranches,
    isBranch: Boolean(currentBranch),
    themeStyle: branchFooterThemeStyle(currentBranch),
  }
}
