import type { ContentSingleGalleryItem } from '@/components/common/content-single/types'
import { resolveMedia } from '@/lib/resolveMedia'
import type { BranchVenueRentalPage, Media } from '@/payload-types'

export type BranchVenueRentalVenueInfoIconItem = {
  icon?: string
  text?: string
}

export type BranchVenueRentalVenueInfoItem = {
  tabId: string
  title: string
  buttonBgColor?: string
  buttonTextColor?: string
  galleryItems: ContentSingleGalleryItem[]
  amenitiesDescription?: NonNullable<
    NonNullable<BranchVenueRentalPage['venues']>[number]['amenitiesDescription']
  >
  venueDescription: NonNullable<
    NonNullable<BranchVenueRentalPage['venues']>[number]['venueDescription']
  >
  information: {
    area?: string
    numberOfPeople?: string
  }
  venueAmenities: BranchVenueRentalVenueInfoIconItem[]
  otherAmenities: BranchVenueRentalVenueInfoIconItem[]
  additionalFee: BranchVenueRentalVenueInfoIconItem[]
  staffFee: {
    title?: string
    info: { title?: string; description?: string }[]
  }
  cta?: {
    text: string
    link: string
    buttonBgColor?: string
  }
}

function resolveGalleryItems(mediaGallery?: (number | Media)[] | null): ContentSingleGalleryItem[] {
  if (!mediaGallery?.length) return []

  return mediaGallery
    .map((media) => resolveMedia(media))
    .filter((item): item is ContentSingleGalleryItem => Boolean(item))
}

function mapIconItems(
  items?: { icon?: string | null; text?: string | null }[] | null,
): BranchVenueRentalVenueInfoIconItem[] {
  if (!items?.length) return []

  return items
    .map((item) => ({
      icon: item.icon ?? undefined,
      text: item.text?.trim() || undefined,
    }))
    .filter((item) => item.icon || item.text)
}

function getVenueTabId(venue: NonNullable<BranchVenueRentalPage['venues']>[number], index: number) {
  return venue.id ? `#venue-${venue.id}` : `#venue-${index}`
}

export function toBranchVenueRentalVenueInfoProps(
  page: BranchVenueRentalPage,
): BranchVenueRentalVenueInfoItem[] {
  if (!page.venues?.length) return []

  return page.venues
    .filter((venue) => venue.show !== false)
    .map((venue, index) => ({
      tabId: getVenueTabId(venue, index),
      title: venue.title?.trim() || `Venue ${index + 1}`,
      buttonBgColor: venue.buttonBgColor?.trim() || undefined,
      buttonTextColor: venue.buttonTextColor?.trim() || undefined,
      galleryItems: resolveGalleryItems(venue.mediaGallery),
      amenitiesDescription: venue.amenitiesDescription ?? undefined,
      venueDescription: venue.venueDescription ?? [],
      information: {
        area: venue.information?.area?.trim() || undefined,
        numberOfPeople: venue.information?.numberOfPeople?.trim() || undefined,
      },
      venueAmenities: mapIconItems(venue.venueAmenities),
      otherAmenities: mapIconItems(venue.otherAmenities),
      additionalFee: mapIconItems(venue.additionalFee),
      staffFee: {
        title: venue.staffFee?.title?.trim() || undefined,
        info:
          venue.staffFee?.info
            ?.map((item) => ({
              title: item.title?.trim() || undefined,
              description: item.description?.trim() || undefined,
            }))
            .filter((item) => item.title || item.description) ?? [],
      },
      cta:
        venue.cta?.ctaText?.trim() && venue.cta?.ctaLink?.trim()
          ? {
              text: venue.cta.ctaText.trim(),
              link: venue.cta.ctaLink.trim(),
              buttonBgColor: venue.cta.buttonBgColor?.trim() || undefined,
            }
          : undefined,
    }))
}
