import type { CardBranchDotItem } from '@/components/branch/components/card-branch-dots'

export const BRANCH_VENDORS_PAGE_SIZE = 9

export type BranchLandingVendorCard = {
  id: number
  title: string
  link: string
  media: {
    src: string
    alt: string
  }
  tags: string[]
  location: string
  branches: CardBranchDotItem[]
}

export type BranchVendorCard = BranchLandingVendorCard & {
  lifestyleIds: number[]
}

export type LifestyleOption = {
  id: number
  text: string
}

export type VendorMapListItem = {
  lotNumber: number
  floor: string
  name: string
  link: string
  tags: string[]
  lotLabel?: string
  isMapOnlyLot?: boolean
  media?: {
    src: string
    alt: string
  }
  openingHoursHtml?: string
}
