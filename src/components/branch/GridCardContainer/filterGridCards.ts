import type { CardBranchDotItem } from '@/components/branch/components/card-branch-dots'

import type { BranchLandingVendorCard, BranchLandingWhatsOnCard } from '@/payload/queries/branch'

import type { GridCardVariant } from './types'

export const GRID_CARD_FILTER_ALL = 'all'

export type GridCard = BranchLandingWhatsOnCard | BranchLandingVendorCard

export type GridCardFilterOption = {
  value: string
  label: string
}

type GridCardWithBranches = {
  branches: CardBranchDotItem[]
}

function buildBranchFilterOptionsFromCards(cards: GridCardWithBranches[]): GridCardFilterOption[] {
  const seen = new Set<string>()
  const branches: GridCardFilterOption[] = []

  for (const card of cards) {
    for (const branch of card.branches) {
      if (seen.has(branch.slug)) continue

      seen.add(branch.slug)
      branches.push({ value: branch.slug, label: branch.name })
    }
  }

  return [{ value: GRID_CARD_FILTER_ALL, label: 'All Branches' }, ...branches]
}

function buildWhatsOnCategoryFilterOptions(
  cards: BranchLandingWhatsOnCard[],
): GridCardFilterOption[] {
  const mainTags: GridCardFilterOption[] = []
  const subTags: GridCardFilterOption[] = []
  const seenMain = new Set<string>()
  const seenSub = new Set<string>()

  for (const card of cards) {
    if (card.mainTag && !seenMain.has(card.mainTag)) {
      seenMain.add(card.mainTag)
      mainTags.push({ value: card.mainTag, label: card.mainTag })
    }

    for (const tag of card.subTags) {
      if (seenSub.has(tag)) continue

      seenSub.add(tag)
      subTags.push({ value: tag, label: tag })
    }
  }

  return [{ value: GRID_CARD_FILTER_ALL, label: 'All Categories' }, ...mainTags, ...subTags]
}

function buildVendorCategoryFilterOptions(
  cards: BranchLandingVendorCard[],
): GridCardFilterOption[] {
  const seen = new Set<string>()
  const categories: GridCardFilterOption[] = []

  for (const card of cards) {
    for (const tag of card.tags) {
      if (seen.has(tag)) continue

      seen.add(tag)
      categories.push({ value: tag, label: tag })
    }
  }

  return [{ value: GRID_CARD_FILTER_ALL, label: 'All Categories' }, ...categories]
}

export function buildBranchFilterOptions(cards: GridCard[]): GridCardFilterOption[] {
  return buildBranchFilterOptionsFromCards(cards)
}

export function buildCategoryFilterOptions(
  cards: GridCard[],
  variant: GridCardVariant,
): GridCardFilterOption[] {
  if (variant === 'whats-on') {
    return buildWhatsOnCategoryFilterOptions(cards as BranchLandingWhatsOnCard[])
  }

  return buildVendorCategoryFilterOptions(cards as BranchLandingVendorCard[])
}

export function filterGridCardsByBranch(cards: GridCard[], branchSlug: string): GridCard[] {
  if (branchSlug === GRID_CARD_FILTER_ALL) return cards

  return cards.filter((card) => card.branches.some((branch) => branch.slug === branchSlug))
}

export function filterGridCardsByCategory(
  cards: GridCard[],
  category: string,
  variant: GridCardVariant,
): GridCard[] {
  if (category === GRID_CARD_FILTER_ALL) return cards

  if (variant === 'whats-on') {
    return (cards as BranchLandingWhatsOnCard[]).filter(
      (card) => card.mainTag === category || card.subTags.includes(category),
    )
  }

  return (cards as BranchLandingVendorCard[]).filter((card) => card.tags.includes(category))
}
