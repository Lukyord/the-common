import { cache } from 'react'
import { notFound } from 'next/navigation'

import type {
  BranchLandingVendorCard,
  BranchVendorCard,
  LifestyleOption,
} from '@/components/branch/vendors/types'

export type {
  BranchLandingVendorCard,
  BranchVendorCard,
  LifestyleOption,
} from '@/components/branch/vendors/types'
export { BRANCH_VENDORS_PAGE_SIZE } from '@/components/branch/vendors/types'
import { BRANCH_VENDORS_PAGE_SIZE } from '@/components/branch/vendors/types'
import {
  normalizeCardBranches,
  type CardBranchDotItem,
} from '@/components/branch/components/card-branch-dots'
import { getWhatsOnBranchLocationText } from '@/constants/whatsOnBranchLocations'
import {
  getActiveWhatsOnWhere,
  getArchivedWhatsOnWhere,
  isWhatsOnArchived,
} from '@/lib/whatsOnArchive'
import { resolveMedia } from '@/lib/resolveMedia'
import type {
  Branch,
  BranchContactPage,
  BranchVendorPage,
  BranchWhatsOnPage,
  Vendor,
  WhatsOn,
} from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'

export const getBranches = cache(async (): Promise<Branch[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'branches',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'createdAt',
  })

  return docs
})

export const getBranchBySlug = cache(async (slug: string): Promise<Branch> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'branches',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const branch = docs[0]
  if (!branch) notFound()

  return branch
})

export const getBranchWhatsOnPageBySlug = cache(
  async (branchSlug: string): Promise<BranchWhatsOnPage> => {
    const branch = await getBranchBySlug(branchSlug)
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'branch-whats-on-pages',
      where: { branch: { equals: branch.id } },
      depth: 1,
      limit: 1,
    })

    const page = docs[0]
    if (!page) notFound()

    return page
  },
)

export const getBranchContactPageBySlug = cache(
  async (branchSlug: string): Promise<BranchContactPage> => {
    const branch = await getBranchBySlug(branchSlug)
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'branch-contact-pages',
      where: { branch: { equals: branch.id } },
      depth: 1,
      limit: 1,
    })

    const page = docs[0]
    if (!page) notFound()

    return page
  },
)

export const getBranchVendorPageBySlug = cache(
  async (branchSlug: string): Promise<BranchVendorPage> => {
    const branch = await getBranchBySlug(branchSlug)
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'branch-vendor-pages',
      where: { branch: { equals: branch.id } },
      depth: 1,
      limit: 1,
    })

    const page = docs[0]
    if (!page) notFound()

    return page
  },
)

const BRANCH_VENDOR_LIMIT = 3

function getVendorCategoryTexts(category: Vendor['category']): string[] {
  if (!category?.length) return []

  return category.flatMap((item) => {
    if (typeof item === 'object' && item?.text) return [item.text]
    return []
  })
}

function getVendorLifestyleIds(lifestyles: Vendor['lifestyles']): number[] {
  return (lifestyles ?? []).flatMap((lifestyle) => {
    if (typeof lifestyle === 'number') return [lifestyle]
    if (lifestyle?.id) return [lifestyle.id]
    return []
  })
}

function getVendorFloorTitle(vendor: Vendor, branch: Branch | null): string {
  if (!vendor.floor || !branch?.floors?.length) return ''

  const floor = branch.floors.find((item) => item.floorId === vendor.floor)
  return floor?.title?.trim() || ''
}

function mapVendorToBranchLandingCard(vendor: Vendor): BranchLandingVendorCard | null {
  const media = resolveMedia(vendor.media)
  const branch = typeof vendor.branch === 'object' ? vendor.branch : null

  if (!media?.src || !branch?.slug) return null

  const tags = getVendorCategoryTexts(vendor.category)

  return {
    id: vendor.id,
    title: vendor.name,
    link: `/${branch.slug}/vendors/${vendor.slug}`,
    media: {
      src: media.src,
      alt: media.alt || vendor.name,
    },
    tags,
    location: getVendorFloorTitle(vendor, branch),
    branches: normalizeCardBranches(vendor.branch),
  }
}

function mapVendorToBranchVendorCard(vendor: Vendor): BranchVendorCard | null {
  const card = mapVendorToBranchLandingCard(vendor)
  if (!card) return null

  return {
    ...card,
    lifestyleIds: getVendorLifestyleIds(vendor.lifestyles),
  }
}

export const getLifestyles = cache(async (): Promise<LifestyleOption[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'lifestyle',
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'text',
  })

  return docs.map(({ id, text }) => ({ id, text }))
})

function buildBranchVendorsWhere(branchId: number, lifestyleIds?: number[]) {
  const branchWhere = {
    branch: {
      equals: branchId,
    },
  }

  if (!lifestyleIds?.length) return branchWhere

  return {
    and: [
      branchWhere,
      {
        or: lifestyleIds.map((id) => ({
          lifestyles: {
            contains: id,
          },
        })),
      },
    ],
  }
}

export const getBranchVendors = async (
  branch: Branch,
  page = 1,
  limit = BRANCH_VENDORS_PAGE_SIZE,
  lifestyleIds?: number[],
): Promise<GridCardPageResult<BranchVendorCard>> => {
  if (!branch?.id) {
    return { cards: [], hasMore: false }
  }

  const payload = await getPayloadClient()
  const { docs, hasNextPage } = await payload.find({
    collection: 'vendors',
    depth: 2,
    page,
    limit,
    overrideAccess: false,
    pagination: true,
    sort: 'name',
    where: buildBranchVendorsWhere(branch.id, lifestyleIds),
  })

  const cards = docs.flatMap((vendor) => {
    const card = mapVendorToBranchVendorCard(vendor)
    return card ? [card] : []
  })

  return {
    cards,
    hasMore: hasNextPage,
  }
}

export const getBranchLandingVendors = cache(
  async (branch: Branch): Promise<BranchLandingVendorCard[]> => {
    if (!branch?.id) return []

    const payload = await getPayloadClient()
    const displayType = branch.vendorsSection?.displayType ?? 'latest'

    const highlightIds =
      branch.vendorsSection?.highlightVendors
        ?.flatMap((vendor) => {
          if (typeof vendor === 'number') return [vendor]
          if (typeof vendor === 'object' && vendor?.id) return [vendor.id]
          return []
        })
        .slice(0, BRANCH_VENDOR_LIMIT) ?? []

    const query =
      displayType === 'highlight' && highlightIds.length
        ? await payload.find({
            collection: 'vendors',
            depth: 1,
            limit: BRANCH_VENDOR_LIMIT,
            overrideAccess: false,
            pagination: false,
            where: {
              and: [
                {
                  id: {
                    in: highlightIds,
                  },
                },
                {
                  branch: {
                    equals: branch.id,
                  },
                },
              ],
            },
          })
        : await payload.find({
            collection: 'vendors',
            depth: 1,
            limit: BRANCH_VENDOR_LIMIT,
            overrideAccess: false,
            pagination: false,
            sort: '-createdAt',
            where: {
              branch: {
                equals: branch.id,
              },
            },
          })

    const docs =
      displayType === 'highlight' && highlightIds.length
        ? [...query.docs].sort((a, b) => highlightIds.indexOf(a.id) - highlightIds.indexOf(b.id))
        : query.docs

    return docs.flatMap((vendor) => {
      const card = mapVendorToBranchLandingCard(vendor)
      return card ? [card] : []
    })
  },
)

const BRANCH_WHATS_ON_LIMIT = 3

export type BranchLandingWhatsOnCard = {
  id: number
  title: string
  link: string
  media: {
    src: string
    alt: string
  }
  bgColor?: string | null
  dateToBeArchived?: string | null
  eventSchedule?: WhatsOn['eventSchedule'] | null
  date?: string | null
  time?: string | null
  mainTag?: string | null
  subTags: string[]
  highlightText?: string | null
  branches: CardBranchDotItem[]
}

function getWhatsOnMainTagText(tag: WhatsOn['mainTag']) {
  if (!tag || typeof tag === 'number') return null
  return tag.text ?? null
}

function getWhatsOnSubTagTexts(tags: WhatsOn['subTags']) {
  if (!tags?.length) return []

  return tags.flatMap((tag) => {
    if (typeof tag === 'number') return []
    return tag.text ? [tag.text] : []
  })
}

function mapWhatsOnToBranchLandingCard(
  item: WhatsOn,
  branchSlug: string,
): BranchLandingWhatsOnCard | null {
  const media = resolveMedia(item.media)
  if (!media?.src) return null

  const highlightText = item.highlightText?.enabled ? item.highlightText.text : null

  return {
    id: item.id,
    title: item.title,
    link: `/${branchSlug}/whats-on/${item.slug}`,
    media: {
      src: media.src,
      alt: media.alt || item.title,
    },
    bgColor: item.bgColor?.trim() || null,
    dateToBeArchived: item.dateToBeArchived ?? null,
    eventSchedule: item.eventSchedule ?? null,
    date: item.date,
    time: item.time,
    mainTag: getWhatsOnMainTagText(item.mainTag),
    subTags: getWhatsOnSubTagTexts(item.subTags),
    highlightText: highlightText ?? null,
    branches: normalizeCardBranches(item.branch),
  }
}

export const getBranchLandingWhatsOn = cache(
  async (branch: Branch): Promise<BranchLandingWhatsOnCard[]> => {
    if (!branch?.id || !branch.slug) return []

    const payload = await getPayloadClient()
    const displayType = branch.whatsOnSection?.displayType ?? 'latest'

    const highlightIds =
      branch.whatsOnSection?.highlightWhatsOn
        ?.flatMap((item) => {
          if (typeof item === 'number') return [item]
          if (typeof item === 'object' && item?.id) return [item.id]
          return []
        })
        .slice(0, BRANCH_WHATS_ON_LIMIT) ?? []

    const branchFilter = {
      branch: {
        contains: branch.id,
      },
    }
    const activeWhatsOnWhere = getActiveWhatsOnWhere()

    const query =
      displayType === 'highlight' && highlightIds.length
        ? await payload.find({
            collection: 'whats-on',
            depth: 1,
            limit: BRANCH_WHATS_ON_LIMIT,
            overrideAccess: false,
            pagination: false,
            where: {
              and: [
                {
                  id: {
                    in: highlightIds,
                  },
                },
                branchFilter,
                activeWhatsOnWhere,
              ],
            },
          })
        : await payload.find({
            collection: 'whats-on',
            depth: 1,
            limit: BRANCH_WHATS_ON_LIMIT,
            overrideAccess: false,
            pagination: false,
            sort: '-createdAt',
            where: {
              and: [branchFilter, activeWhatsOnWhere],
            },
          })

    const docs =
      displayType === 'highlight' && highlightIds.length
        ? [...query.docs].sort((a, b) => highlightIds.indexOf(a.id) - highlightIds.indexOf(b.id))
        : query.docs

    return docs.flatMap((item) => {
      if (isWhatsOnArchived(item)) return []
      const card = mapWhatsOnToBranchLandingCard(item, branch.slug)
      return card ? [card] : []
    })
  },
)

export const getBranchWhatsOnByMainTag = cache(
  async (branch: Branch, mainTagId: number): Promise<BranchLandingWhatsOnCard[]> => {
    if (!branch?.id || !branch.slug || !mainTagId) return []

    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'whats-on',
      depth: 1,
      limit: BRANCH_WHATS_ON_LIMIT,
      overrideAccess: false,
      pagination: false,
      sort: '-createdAt',
      where: {
        and: [
          {
            branch: {
              contains: branch.id,
            },
          },
          {
            mainTag: {
              equals: mainTagId,
            },
          },
          getActiveWhatsOnWhere(),
        ],
      },
    })

    return docs.flatMap((item) => {
      if (isWhatsOnArchived(item)) return []
      const card = mapWhatsOnToBranchLandingCard(item, branch.slug)
      return card ? [card] : []
    })
  },
)

export const getBranchWhatsOnLatest = cache(
  async (branch: Branch): Promise<BranchLandingWhatsOnCard[]> => {
    if (!branch?.id || !branch.slug) return []

    const payload = await getPayloadClient()
    const branchFilter = {
      branch: {
        contains: branch.id,
      },
    }
    const activeWhatsOnWhere = getActiveWhatsOnWhere()

    const { docs } = await payload.find({
      collection: 'whats-on',
      depth: 1,
      limit: 200,
      overrideAccess: false,
      pagination: false,
      sort: 'createdAt',
      where: {
        and: [branchFilter, activeWhatsOnWhere],
      },
    })

    return docs.flatMap((item) => {
      if (isWhatsOnArchived(item)) return []
      const card = mapWhatsOnToBranchLandingCard(item, branch.slug)
      return card ? [card] : []
    })
  },
)

export const GRID_CARD_PAGE_SIZE = 12

export type GridCardPageResult<T extends { id: number }> = {
  cards: T[]
  hasMore: boolean
}

export type WhatsOnSingleBranch = {
  slug: string
  name: string
  location: string | null
  bgColor: string | null
  color: string | null
}

export type WhatsOnSingleData = {
  title: string
  date?: string | null
  dateToBeArchived?: string | null
  time?: string | null
  mainTag?: string | null
  subTags: string[]
  branches: WhatsOnSingleBranch[]
  content?: WhatsOn['content'] | null
  buttonText?: string | null
  buttonLink?: string | null
  buttonColor?: string | null
  bgColor?: string | null
  gallery: { src: string; alt: string }[]
  meta?: WhatsOn['meta']
}

function mapWhatsOnSingleBranches(item: WhatsOn): WhatsOnSingleBranch[] {
  if (!item.branch?.length) return []

  return item.branch.flatMap((entry) => {
    if (typeof entry === 'number' || !entry.slug) return []

    return [
      {
        slug: entry.slug,
        name: entry.name,
        location: getWhatsOnBranchLocationText(entry.slug, item.branchLocations),
        bgColor: entry.vibesCheck?.secondaryColor?.trim() || null,
        color: entry.vibesCheck?.primaryColor?.trim() || null,
      },
    ]
  })
}

function resolveGalleryMedia(gallery?: WhatsOn['gallery']) {
  if (!gallery?.length) return []

  return gallery.flatMap((item) => {
    const media = resolveMedia(item)
    return media ? [media] : []
  })
}

function whatsOnBelongsToBranch(item: WhatsOn, branchId: number) {
  if (!item.branch?.length) return false

  return item.branch.some((entry) => {
    if (typeof entry === 'number') return entry === branchId
    return entry.id === branchId
  })
}

export const getWhatsOnBySlug = cache(
  async (branchSlug: string, slug: string): Promise<WhatsOnSingleData> => {
    const branch = await getBranchBySlug(branchSlug)
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'whats-on',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
      overrideAccess: false,
    })

    const item = docs[0]
    if (!item || !whatsOnBelongsToBranch(item, branch.id)) notFound()

    const gallery = resolveGalleryMedia(item.gallery)
    const fallbackMedia = resolveMedia(item.media)

    return {
      title: item.title,
      date: item.date,
      dateToBeArchived: item.dateToBeArchived ?? null,
      time: item.time,
      mainTag: getWhatsOnMainTagText(item.mainTag),
      subTags: getWhatsOnSubTagTexts(item.subTags),
      branches: mapWhatsOnSingleBranches(item),
      content: item.content,
      buttonText: item.buttonText,
      buttonLink: item.buttonLink,
      buttonColor: branch.bgColor?.trim() || null,
      bgColor: item.bgColor?.trim() || null,
      gallery: gallery.length ? gallery : fallbackMedia ? [fallbackMedia] : [],
      meta: item.meta,
    }
  },
)

export const getBranchWhatsOnArchived = async (
  branch: Branch,
  page = 1,
  limit = GRID_CARD_PAGE_SIZE,
): Promise<GridCardPageResult<BranchLandingWhatsOnCard>> => {
  if (!branch?.id || !branch.slug) {
    return { cards: [], hasMore: false }
  }

  const payload = await getPayloadClient()
  const { docs, hasNextPage } = await payload.find({
    collection: 'whats-on',
    depth: 1,
    page,
    limit,
    overrideAccess: false,
    pagination: true,
    sort: '-dateToBeArchived',
    where: {
      and: [
        {
          branch: {
            contains: branch.id,
          },
        },
        getArchivedWhatsOnWhere(),
      ],
    },
  })

  const cards = docs.flatMap((item) => {
    const card = mapWhatsOnToBranchLandingCard(item, branch.slug)
    return card ? [card] : []
  })

  return {
    cards,
    hasMore: hasNextPage,
  }
}
