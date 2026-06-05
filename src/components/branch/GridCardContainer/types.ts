import type { ReactNode } from 'react'

import type {
  BranchLandingVendorCard,
  BranchLandingWhatsOnCard,
} from '@/payload/queries/branch'

export type GridCardItem = {
  id: number
}

export type GridCardVariant = 'whats-on' | 'vendor'

export type GridCardSortOrder = 'oldest-newest' | 'newest-oldest'

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
  filterSlot?: ReactNode
  hasMore?: boolean
  loadMoreUrl?: string
  loadMoreParams?: Record<string, string>
  seeMoreLabel?: string
  emptyMessage?: string
  cardLayout?: 'grid' | 'grid-minmax'
  cardContext: GridCardContext
}

export type GridCardContainerProps =
  | (GridCardContainerBaseProps & {
      cardVariant: 'whats-on'
      cards: BranchLandingWhatsOnCard[]
    })
  | (GridCardContainerBaseProps & {
      cardVariant: 'vendor'
      cards: BranchLandingVendorCard[]
    })
