import type { VendorMapFloorId } from '@/constants/vendorMapData/index'
import type { VendorMapListItem } from '@/components/branch/vendors/types'
import { useEffect, useMemo, type RefObject } from 'react'

const preloadedUrls = new Set<string>()

function preloadImages(urls: string[]) {
  for (const src of urls) {
    if (!src || preloadedUrls.has(src)) continue
    preloadedUrls.add(src)

    const img = new Image()
    img.decoding = 'async'
    img.src = src
  }
}

function collectFloorVendorImageUrls(
  mapVendors: VendorMapListItem[],
  floorId: VendorMapFloorId,
): string[] {
  const urls: string[] = []

  for (const vendor of mapVendors) {
    if (vendor.floor !== floorId || !vendor.media?.src) continue
    urls.push(vendor.media.src)
  }

  return urls
}

type UseVendorMapImagePreloadOptions = {
  sectionRef: RefObject<HTMLElement | null>
  mapVendors: VendorMapListItem[]
  displayedFloor: VendorMapFloorId
}

export function useVendorMapImagePreload({
  sectionRef,
  mapVendors,
  displayedFloor,
}: UseVendorMapImagePreloadOptions) {
  const imageUrls = useMemo(
    () => collectFloorVendorImageUrls(mapVendors, displayedFloor),
    [mapVendors, displayedFloor],
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section || imageUrls.length === 0) return

    const preload = () => preloadImages(imageUrls)

    const preloadIfNearViewport = () => {
      const rect = section.getBoundingClientRect()
      const inView = rect.bottom > -400 && rect.top < window.innerHeight + 400
      if (inView) preload()
    }

    preloadIfNearViewport()

    if (!('IntersectionObserver' in window)) {
      preload()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        preload()
      },
      { rootMargin: '400px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [imageUrls, sectionRef])
}
