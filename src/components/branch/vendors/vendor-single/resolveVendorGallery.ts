import { resolveMedia } from '@/lib/resolveMedia'
import type { Vendor } from '@/payload-types'

export function resolveVendorGallery(vendor: Vendor) {
  const gallery =
    vendor.gallery?.flatMap((item) => {
      const media = resolveMedia(item)
      return media ? [media] : []
    }) ?? []

  const fallbackMedia = resolveMedia(vendor.media)
  return gallery.length ? gallery : fallbackMedia ? [fallbackMedia] : []
}
