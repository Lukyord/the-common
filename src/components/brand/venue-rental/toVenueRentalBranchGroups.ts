import type { ContentSingleGalleryItem } from '@/components/common/content-single/types'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Media, VenueRentalPage } from '@/payload-types'
import type { VenueRentalBranchVenuePage } from '@/payload/queries/venue-rental-page'

import type { VenueRentalBranchGroup } from './types'

function getBranchId(branch: VenueRentalBranchVenuePage['branch']): number | null {
  if (typeof branch === 'number') return branch
  if (branch?.id) return branch.id
  return null
}

function getVenueFormOptionNames(page?: VenueRentalBranchVenuePage | null): string[] {
  if (!page?.venues?.length) return []

  return page.venues
    .filter((venue) => venue.show !== false)
    .map((venue) => venue.formOptionName?.trim())
    .filter((name): name is string => Boolean(name))
}

function getVenueTitles(page?: VenueRentalBranchVenuePage | null): string[] {
  if (!page?.venues?.length) return []

  return page.venues
    .filter((venue) => venue.show !== false)
    .map((venue) => venue.title?.trim())
    .filter((title): title is string => Boolean(title))
}

function mapBranchVenueRentalPagesByBranchId(
  pages?: VenueRentalBranchVenuePage[] | null,
): Map<number, VenueRentalBranchVenuePage> {
  const map = new Map<number, VenueRentalBranchVenuePage>()
  if (!pages?.length) return map

  for (const page of pages) {
    const branchId = getBranchId(page.branch)
    if (branchId) map.set(branchId, page)
  }

  return map
}

function resolveGalleryItems(mediaGallery?: (number | Media)[] | null): ContentSingleGalleryItem[] {
  if (!mediaGallery?.length) return []

  return mediaGallery
    .map((media) => resolveMedia(media))
    .filter((item): item is ContentSingleGalleryItem => Boolean(item))
}

export function toVenueRentalBranchGroups(
  branchGroups?: VenueRentalPage['branchGroups'],
  branchVenueRentalPages?: VenueRentalBranchVenuePage[] | null,
): VenueRentalBranchGroup[] {
  if (!branchGroups?.length) return []

  const branchVenuePagesByBranchId = mapBranchVenueRentalPagesByBranchId(branchVenueRentalPages)

  return branchGroups
    .map((group) => {
      const branch = group.branch
      if (!branch || typeof branch === 'number') return null

      const slug = branch.slug
      if (!slug) return null

      const branchVenuePage = branchVenuePagesByBranchId.get(branch.id)

      return {
        tabId: `#${slug}`,
        branchSlug: slug,
        branchName: branch.name,
        galleryItems: resolveGalleryItems(group.mediaGallery),
        bgColor: group.bgColor,
        textColor: group.textColor,
        buttonColor: group.buttonColor,
        buttonWhiteTextOnHover: group.buttonWhiteTextOnHover,
        buttonDarkBrownTextOnHover: group.buttonDarkBrownTextOnHover,
        title: group.title,
        cta: group.cta,
        bookingCta: branchVenuePage?.bookingCta,
        venues: getVenueTitles(branchVenuePage),
        formAreaOptions: getVenueFormOptionNames(branchVenuePage),
      }
    })
    .filter((group): group is NonNullable<typeof group> => Boolean(group))
}
