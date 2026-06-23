import type { ContentSingleGalleryItem } from '@/components/common/content-single/types'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Media, VenueRentalPage } from '@/payload-types'

import type { VenueRentalBranchGroup } from './types'

function resolveGalleryItems(
  mediaGallery?: (number | Media)[] | null,
): ContentSingleGalleryItem[] {
  if (!mediaGallery?.length) return []

  return mediaGallery
    .map((media) => resolveMedia(media))
    .filter((item): item is ContentSingleGalleryItem => Boolean(item))
}

export function toVenueRentalBranchGroups(
  branchGroups?: VenueRentalPage['branchGroups'],
): VenueRentalBranchGroup[] {
  if (!branchGroups?.length) return []

  return branchGroups
    .map((group) => {
      const branch = group.branch
      if (!branch || typeof branch === 'number') return null

      const slug = branch.slug
      if (!slug) return null

      return {
        tabId: `#${slug}`,
        branchSlug: slug,
        branchName: branch.name,
        galleryItems: resolveGalleryItems(group.mediaGallery),
        bgColor: group.bgColor,
        textColor: group.textColor,
        buttonColor: group.buttonColor,
        title: group.title,
        cta: group.cta,
      }
    })
    .filter((group): group is VenueRentalBranchGroup => Boolean(group))
}
