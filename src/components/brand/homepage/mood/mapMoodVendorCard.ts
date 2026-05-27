import { MOOD_VENDOR_SLUGS } from '@/constants/moodVendors'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Vendor } from '@/payload-types'

export type MoodVendorBranch = {
  name: string
  bgColor: string
  color: string
}

export type MoodVendorCard = {
  id: number
  media: {
    src: string
    alt: string
  }
  title: string
  link: string
  branch: MoodVendorBranch
}

export type MoodVendorPoolItem = {
  id: number
  name: string
  slug: string
  branchSlug: string
  lifestyleIds: number[]
  card: MoodVendorCard
}

function getLifestyleIds(vendor: Vendor): number[] {
  return (vendor.lifestyles ?? []).flatMap((lifestyle) => {
    if (typeof lifestyle === 'number') return [lifestyle]
    if (lifestyle?.id) return [lifestyle.id]
    return []
  })
}

export function mapVendorToMoodCard(vendor: Vendor): MoodVendorCard | null {
  const media = resolveMedia(vendor.media)
  const branch = typeof vendor.branch === 'object' ? vendor.branch : null

  if (!media?.src || !branch?.slug) {
    return null
  }

  return {
    id: vendor.id,
    media: { src: media.src, alt: media.alt || vendor.name },
    title: vendor.name,
    link: `/${branch.slug}/vendor/${vendor.slug}`,
    branch: {
      name: branch.name,
      bgColor: branch.bgColor ?? 'var(--color-white)',
      color: branch.primaryColor ?? 'var(--color-body-black)',
    },
  }
}

export function mapVendorToPoolItem(vendor: Vendor): MoodVendorPoolItem | null {
  const card = mapVendorToMoodCard(vendor)
  const branch = typeof vendor.branch === 'object' ? vendor.branch : null
  const lifestyleIds = getLifestyleIds(vendor)

  if (!card || !branch?.slug || lifestyleIds.length === 0) {
    return null
  }

  return {
    id: vendor.id,
    name: vendor.name,
    slug: vendor.slug,
    branchSlug: branch.slug,
    lifestyleIds,
    card,
  }
}

export function mapMoodVendorPool(vendors: Vendor[]): MoodVendorPoolItem[] {
  return vendors.flatMap((vendor) => {
    const item = mapVendorToPoolItem(vendor)
    return item ? [item] : []
  })
}

export function orderMoodVendors(vendors: Vendor[]): Vendor[] {
  return MOOD_VENDOR_SLUGS.flatMap((slug) => {
    const vendor = vendors.find((doc) => doc.slug === slug)
    return vendor ? [vendor] : []
  })
}

export function mapMoodVendorCards(vendors: Vendor[]): MoodVendorCard[] {
  return orderMoodVendors(vendors).flatMap((vendor) => {
    const card = mapVendorToMoodCard(vendor)
    return card ? [card] : []
  })
}
