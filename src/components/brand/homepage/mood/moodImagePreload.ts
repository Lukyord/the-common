import type { MoodVendorCard, MoodVendorPoolItem } from '@/components/brand/homepage/mood/mapMoodVendorCard'

const preloadedUrls = new Set<string>()

export function collectMoodImageUrls(
  vendorPool: MoodVendorPoolItem[],
  defaultVendors: MoodVendorCard[],
): string[] {
  const urls = new Set<string>()

  for (const vendor of defaultVendors) {
    if (vendor.media.src) urls.add(vendor.media.src)
  }

  for (const item of vendorPool) {
    if (item.card.media.src) urls.add(item.card.media.src)
  }

  return [...urls]
}

export function collectMoodImageUrlsForLifestyle(
  vendorPool: MoodVendorPoolItem[],
  lifestyleId: number,
): string[] {
  const urls = new Set<string>()

  for (const item of vendorPool) {
    if (!item.lifestyleIds.includes(lifestyleId)) continue
    if (item.card.media.src) urls.add(item.card.media.src)
  }

  return [...urls]
}

export function preloadImages(urls: string[]) {
  for (const src of urls) {
    if (!src || preloadedUrls.has(src)) continue
    preloadedUrls.add(src)

    const img = new Image()
    img.decoding = 'async'
    img.src = src
  }
}
