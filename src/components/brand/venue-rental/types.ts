import type { ContentSingleGalleryItem } from '@/components/common/content-single/types'
import type { BranchVenueRentalPage } from '@/payload-types'

export type VenueRentalBookingCta = NonNullable<BranchVenueRentalPage['bookingCta']>

export type VenueRentalBranchGroup = {
  tabId: string
  branchSlug: string
  branchName: string
  galleryItems: ContentSingleGalleryItem[]
  bgColor?: string | null
  textColor?: string | null
  buttonColor?: string | null
  buttonWhiteTextOnHover?: boolean | null
  buttonDarkBrownTextOnHover?: boolean | null
  title?: string | null
  cta?: {
    text?: string | null
    desc?: string | null
  }
  bookingCta?: VenueRentalBookingCta | null
  venues: string[]
  formAreaOptions: string[]
}
