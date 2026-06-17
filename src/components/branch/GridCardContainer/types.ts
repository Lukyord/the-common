import type { ReactNode } from 'react'

import type { BranchLandingVendorCard, BranchLandingWhatsOnCard } from '@/payload/queries/branch'
import type { MultiBranchVendorInfo } from '@/components/branch/vendors/types'

export type GridCardItem = {
  id: number
}

export type GridCardVariant = 'whats-on' | 'vendor'

export type GridCardSortOrder = 'oldest-newest' | 'newest-oldest'

export type GridCardUrlFilterParams = {
  categoryParam: string
  branchParam?: string
  sortParam?: string
}

export type GridCardContext = {
  branchSlug: string
  themeColor?: {
    bgColor: string
    color: string
  }
  backgroundColor?: string | null
}

export type GridCardLoadMoreResult<TCard extends GridCardItem> = {
  cards: TCard[]
  hasMore: boolean
}

type GridCardContainerBaseProps = {
  backLink?: {
    href: string
    label?: string
  }
  title: string
  showCount?: boolean
  showSort?: boolean
  showBranchFilter?: boolean
  showCategoryFilter?: boolean
  initialCategoryFilter?: string
  syncFiltersToUrl?: GridCardUrlFilterParams
  filterSlot?: ReactNode
  hasMore?: boolean
  loadMoreUrl?: string
  loadMoreParams?: Record<string, string>
  seeMoreLabel?: string
  emptyMessage?: string
  cardLayout?: 'grid' | 'grid-minmax'
  cardContext: GridCardContext
  multiBranchVendorsByName?: Record<string, MultiBranchVendorInfo>
}

export type GridCardContainerProps =
  | (GridCardContainerBaseProps & {
      cardVariant: 'whats-on'
      cards: BranchLandingWhatsOnCard[]
      filterOptionCards?: BranchLandingWhatsOnCard[]
    })
  | (GridCardContainerBaseProps & {
      cardVariant: 'vendor'
      cards: BranchLandingVendorCard[]
      filterOptionCards?: BranchLandingVendorCard[]
    })
