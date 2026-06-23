import type { ContentSingleGalleryItem } from '@/components/common/content-single/types'

export type VenueRentalBranchGroup = {
  tabId: string
  branchSlug: string
  branchName: string
  galleryItems: ContentSingleGalleryItem[]
  bgColor?: string | null
  textColor?: string | null
  buttonColor?: string | null
  title?: string | null
  cta?: {
    text?: string | null
    desc?: string | null
  }
}
