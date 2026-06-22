import { cache } from 'react'
import { notFound } from 'next/navigation'

import type {
  BranchLandingVendorCard,
  BranchVendorCard,
  LifestyleOption,
  MultiBranchVendorBranch,
  MultiBranchVendorInfo,
  VendorMapListItem,
} from '@/components/branch/vendors/types'

export type {
  BranchLandingVendorCard,
  BranchVendorCard,
  LifestyleOption,
  MultiBranchVendorBranch,
  MultiBranchVendorInfo,
  VendorMapListItem,
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
import {
  buildNextCalendarMonths,
  cardOverlapsMonth,
  paginateCalendarCards,
  sortCardsByEarliestDateInMonth,
  WHATS_ON_CALENDAR_PAGE_SIZE,
  type CalendarMonthDefinition,
} from '@/lib/whatsOnCalendar'
import { lexicalToHtml } from '@/lib/lexicalToHtml'
import { resolveMedia } from '@/lib/resolveMedia'
import type {
  Branch,
  BranchContactPage,
  BranchSpaceRentalPage,
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

export const getBranchSpaceRentalPageBySlug = cache(
  async (branchSlug: string): Promise<BranchSpaceRentalPage> => {
    const branch = await getBranchBySlug(branchSlug)
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'branch-space-rental-pages',
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
const VENDOR_RELATED_LIMIT = 3

function getVendorBranchId(branch: Vendor['branch']): number | null {
  if (typeof branch === 'number') return branch
  if (branch?.id) return branch.id
  return null
}

function getVendorFirstCategoryId(category: Vendor['category']): number | null {
  const firstCategory = category?.[0]
  if (!firstCategory) return null
  if (typeof firstCategory === 'number') return firstCategory
  if (firstCategory.id) return firstCategory.id
  return null
}

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

function mapVendorToMapListItem(vendor: Vendor, branchSlug: string): VendorMapListItem | null {
  if (!vendor.floor || !vendor.lotNumber) return null

  const media = resolveMedia(vendor.media)
  const openingHoursHtml = lexicalToHtml(vendor.openingHours)

  return {
    lotNumber: vendor.lotNumber,
    floor: vendor.floor,
    name: vendor.name,
    link: `/${branchSlug}/vendors/${vendor.slug}`,
    tags: getVendorCategoryTexts(vendor.category),
    media: media?.src
      ? {
          src: media.src,
          alt: media.alt || vendor.name,
        }
      : undefined,
    openingHoursHtml: openingHoursHtml || undefined,
  }
}

export const getBranchMapVendors = cache(async (branch: Branch): Promise<VendorMapListItem[]> => {
  if (!branch?.id) return []

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'vendors',
    depth: 1,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    sort: 'lotNumber',
    where: {
      and: [
        { branch: { equals: branch.id } },
        { floor: { exists: true } },
        { lotNumber: { exists: true } },
      ],
    },
  })

  return docs.flatMap((vendor) => {
    const item = mapVendorToMapListItem(vendor, branch.slug)
    return item ? [item] : []
  })
})

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
  const { docs } = await payload.find({
    collection: 'vendors',
    depth: 2,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    sort: 'name',
    where: buildBranchVendorsWhere(branch.id, lifestyleIds),
  })

  const allCards = docs.flatMap((vendor) => {
    const card = mapVendorToBranchVendorCard(vendor)
    return card ? [card] : []
  })
  const start = (page - 1) * limit
  const cards = allCards.slice(start, start + limit)

  return {
    cards,
    hasMore: start + limit < allCards.length,
  }
}

async function findVendorCategoryIdsByText(query: string): Promise<number[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'vendor-categories',
    where: {
      text: {
        contains: trimmed,
      },
    },
    limit: 100,
    overrideAccess: false,
    pagination: false,
  })

  return docs.map((category) => category.id)
}

function buildVendorTextSearchWhere(query: string, categoryIds: number[]) {
  const orConditions: Record<string, unknown>[] = [
    {
      name: {
        contains: query,
      },
    },
  ]

  for (const categoryId of categoryIds) {
    orConditions.push({
      category: {
        contains: categoryId,
      },
    })
  }

  return { or: orConditions }
}

async function resolveVendorBranchIdBySlug(branchSlug?: string): Promise<number | null> {
  const trimmed = branchSlug?.trim()
  if (!trimmed || trimmed === 'all') return null

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'branches',
    where: { slug: { equals: trimmed } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  })

  return docs[0]?.id ?? null
}

function buildVendorSearchWhere(query: string, categoryIds: number[], branchId?: number | null) {
  const textWhere = buildVendorTextSearchWhere(query, categoryIds)
  if (!branchId) return textWhere

  return {
    and: [
      textWhere,
      {
        branch: {
          equals: branchId,
        },
      },
    ],
  }
}

export const searchVendorsByText = async (
  query: string,
  page = 1,
  limit = BRANCH_VENDORS_PAGE_SIZE,
  branchSlug?: string,
): Promise<GridCardPageResult<BranchVendorCard>> => {
  const trimmed = query.trim()
  if (!trimmed) {
    return { cards: [], hasMore: false }
  }

  const payload = await getPayloadClient()
  const [categoryIds, branchId] = await Promise.all([
    findVendorCategoryIdsByText(trimmed),
    resolveVendorBranchIdBySlug(branchSlug),
  ])
  const where = buildVendorSearchWhere(trimmed, categoryIds, branchId)

  if (!branchId) {
    const [multiBranchVendorsByName, { docs }] = await Promise.all([
      getMultiBranchVendorLookup(),
      payload.find({
        collection: 'vendors',
        depth: 2,
        limit: 500,
        overrideAccess: false,
        pagination: false,
        sort: 'name',
        where,
      }),
    ])

    const allCards = docs.flatMap((vendor) => {
      const card = mapVendorToBranchVendorCard(vendor)
      return card ? [card] : []
    })
    const deduped = dedupeMultiBranchVendorCards(allCards, multiBranchVendorsByName)
    const start = (page - 1) * limit
    const cards = deduped.slice(start, start + limit) as BranchVendorCard[]

    return {
      cards,
      hasMore: start + limit < deduped.length,
    }
  }

  const { docs, hasNextPage } = await payload.find({
    collection: 'vendors',
    depth: 2,
    page,
    limit,
    overrideAccess: false,
    pagination: true,
    sort: 'name',
    where,
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

function getVendorBranchSlug(vendor: Vendor): string | null {
  const branch = typeof vendor.branch === 'object' ? vendor.branch : null
  return branch?.slug ?? null
}

function resolveVendorMedia(vendor: Vendor, fallbackName: string) {
  const media = resolveMedia(vendor.media)
  if (!media?.src) return null

  return {
    src: media.src,
    alt: media.alt || fallbackName,
  }
}

export const getMultiBranchVendorLookup = cache(
  async (): Promise<Record<string, MultiBranchVendorInfo>> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vendors',
      depth: 2,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      sort: 'name',
    })

    const vendorsByName = new Map<string, Vendor[]>()

    for (const vendor of docs) {
      const name = vendor.name.trim()
      if (!name) continue

      const vendors = vendorsByName.get(name) ?? []
      vendors.push(vendor)
      vendorsByName.set(name, vendors)
    }

    const lookup: Record<string, MultiBranchVendorInfo> = {}

    for (const [name, vendors] of vendorsByName) {
      const seenBranchSlugs = new Set<string>()
      const branches: MultiBranchVendorBranch[] = []

      for (const vendor of vendors) {
        for (const branch of normalizeCardBranches(vendor.branch)) {
          if (seenBranchSlugs.has(branch.slug)) continue

          seenBranchSlugs.add(branch.slug)
          branches.push({
            ...branch,
            link: `/${branch.slug}/vendors/${vendor.slug}`,
          })
        }
      }

      if (branches.length < 2) continue

      branches.sort((a, b) => a.slug.localeCompare(b.slug))

      const firstBranchSlug = branches[0].slug
      const firstBranchVendor =
        vendors.find((vendor) => getVendorBranchSlug(vendor) === firstBranchSlug) ?? vendors[0]
      const media =
        resolveVendorMedia(firstBranchVendor, name) ??
        vendors.flatMap((vendor) => {
          const resolved = resolveVendorMedia(vendor, name)
          return resolved ? [resolved] : []
        })[0]

      if (!media) continue

      lookup[name] = { branches, media }
    }

    return lookup
  },
)

export function dedupeMultiBranchVendorCards(
  cards: BranchLandingVendorCard[],
  multiBranchVendorsByName: Record<string, MultiBranchVendorInfo>,
): BranchLandingVendorCard[] {
  const result: BranchLandingVendorCard[] = []
  const multiBranchCardsByTitle = new Map<string, BranchLandingVendorCard>()

  for (const card of cards) {
    if (!multiBranchVendorsByName[card.title]) {
      result.push(card)
      continue
    }

    const existing = multiBranchCardsByTitle.get(card.title)
    if (!existing) {
      multiBranchCardsByTitle.set(card.title, { ...card, tags: [...card.tags] })
      continue
    }

    existing.tags = [...new Set([...existing.tags, ...card.tags])]
  }

  return [...result, ...multiBranchCardsByTitle.values()]
}

export function resolveInitialVendorCategoryFilter(
  cards: BranchLandingVendorCard[],
  categoryText: string | undefined | null,
  resolvedFromCms: { text: string } | null,
): string | null {
  if (resolvedFromCms?.text) return resolvedFromCms.text

  const trimmed = categoryText?.trim()
  if (!trimmed) return null

  const normalized = trimmed.toLowerCase()
  for (const card of cards) {
    const match = card.tags.find((tag) => tag.toLowerCase() === normalized)
    if (match) return match
  }

  return trimmed
}

export function resolveInitialWhatsOnTagFilter(
  cards: BranchLandingWhatsOnCard[],
  tagText: string | undefined | null,
  resolvedFromCms: { text: string } | null,
): string | null {
  if (resolvedFromCms?.text) return resolvedFromCms.text

  const trimmed = tagText?.trim()
  if (!trimmed) return null

  const normalized = trimmed.toLowerCase()
  for (const card of cards) {
    if (card.mainTag?.toLowerCase() === normalized) return card.mainTag

    const subMatch = card.subTags.find((tag) => tag.toLowerCase() === normalized)
    if (subMatch) return subMatch
  }

  return trimmed
}

export const getVendorBySlug = cache(async (branchSlug: string, slug: string): Promise<Vendor> => {
  const branch = await getBranchBySlug(branchSlug)
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'vendors',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })

  const vendor = docs[0]
  if (!vendor || getVendorBranchId(vendor.branch) !== branch.id) notFound()

  return vendor
})

export const getRelatedBranchVendorsByCategory = cache(
  async (branch: Branch, vendor: Vendor): Promise<BranchLandingVendorCard[]> => {
    const categoryId = getVendorFirstCategoryId(vendor.category)
    if (!categoryId || !branch?.id) return []

    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vendors',
      depth: 1,
      limit: VENDOR_RELATED_LIMIT,
      overrideAccess: false,
      pagination: false,
      sort: 'name',
      where: {
        and: [
          { branch: { equals: branch.id } },
          { category: { contains: categoryId } },
          { id: { not_equals: vendor.id } },
        ],
      },
    })

    return docs.flatMap((item) => {
      const card = mapVendorToBranchLandingCard(item)
      return card ? [card] : []
    })
  },
)

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

export const getGlobalWhatsOnByMainTag = cache(
  async (mainTagId: number): Promise<BranchLandingWhatsOnCard[]> => {
    return getGlobalWhatsOnByMainTags([mainTagId])
  },
)

export const getGlobalWhatsOnByMainTags = cache(
  async (mainTagIds: number[]): Promise<BranchLandingWhatsOnCard[]> => {
    const uniqueIds = [...new Set(mainTagIds.filter((id) => Number.isFinite(id) && id > 0))]
    if (!uniqueIds.length) return []

    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'whats-on',
      depth: 1,
      limit: 200,
      overrideAccess: false,
      pagination: false,
      sort: '-createdAt',
      where: {
        and: [
          {
            mainTag: {
              in: uniqueIds,
            },
          },
          getActiveWhatsOnWhere(),
        ],
      },
    })

    const cards = new Map<number, BranchLandingWhatsOnCard>()

    for (const item of docs) {
      if (isWhatsOnArchived(item)) continue

      const branches = normalizeCardBranches(item.branch)
      const branchSlug = branches[0]?.slug
      if (!branchSlug) continue

      const card = mapWhatsOnToBranchLandingCard(item, branchSlug)
      if (card) cards.set(card.id, card)
    }

    return [...cards.values()]
  },
)

export type WhatsOnCalendarMonth = CalendarMonthDefinition & {
  cards: BranchLandingWhatsOnCard[]
  hasMore: boolean
}

export const getGlobalWhatsOnCalendarMonth = cache(
  async (
    mainTagIds: number[],
    year: number,
    month: number,
    page = 1,
    limit = WHATS_ON_CALENDAR_PAGE_SIZE,
  ): Promise<GridCardPageResult<BranchLandingWhatsOnCard>> => {
    const allCards = await getGlobalWhatsOnByMainTags(mainTagIds)
    const monthCards = sortCardsByEarliestDateInMonth(
      allCards.filter((card) => cardOverlapsMonth(card, year, month)),
      year,
      month,
    )

    return paginateCalendarCards(monthCards, page, limit)
  },
)

export const getGlobalWhatsOnCalendarMonths = cache(
  async (mainTagIds: number[]): Promise<WhatsOnCalendarMonth[]> => {
    const months = buildNextCalendarMonths()

    return Promise.all(
      months.map(async ({ id, title, year, month }) => {
        const { cards, hasMore } = await getGlobalWhatsOnCalendarMonth(
          mainTagIds,
          year,
          month,
          1,
          WHATS_ON_CALENDAR_PAGE_SIZE,
        )

        return {
          id,
          title,
          year,
          month,
          cards,
          hasMore,
        }
      }),
    )
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

type ResolvedWhatsOnTag = {
  id: number
  text: string
  type: 'main' | 'sub'
}

function normalizeWhatsOnTagText(value: string) {
  return value.trim().toLowerCase()
}

async function findWhatsOnTagByText(
  collection: 'whats-on-main-tags' | 'whats-on-sub-tags',
  tagText: string,
  type: ResolvedWhatsOnTag['type'],
): Promise<ResolvedWhatsOnTag | null> {
  const payload = await getPayloadClient()
  const trimmed = tagText.trim()
  if (!trimmed) return null

  const { docs: exactDocs } = await payload.find({
    collection,
    where: { text: { equals: trimmed } },
    limit: 1,
  })

  const exactMatch = exactDocs[0]
  if (exactMatch?.text) {
    return { id: exactMatch.id, text: exactMatch.text, type }
  }

  const { docs } = await payload.find({
    collection,
    limit: 200,
    pagination: false,
  })

  const normalized = normalizeWhatsOnTagText(trimmed)
  const match = docs.find((doc) => doc.text && normalizeWhatsOnTagText(doc.text) === normalized)
  if (!match?.text) return null

  return { id: match.id, text: match.text, type }
}

export const resolveWhatsOnTagByText = cache(
  async (tagText: string): Promise<ResolvedWhatsOnTag | null> => {
    const mainTag = await findWhatsOnTagByText('whats-on-main-tags', tagText, 'main')
    if (mainTag) return mainTag

    return findWhatsOnTagByText('whats-on-sub-tags', tagText, 'sub')
  },
)

export const getBranchWhatsOnForFilter = cache(
  async (branch: Branch): Promise<BranchLandingWhatsOnCard[]> => {
    if (!branch?.id || !branch.slug) return []

    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'whats-on',
      depth: 1,
      limit: 500,
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

export const getGlobalWhatsOnForFilter = cache(async (): Promise<BranchLandingWhatsOnCard[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'whats-on',
    depth: 1,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    sort: '-createdAt',
    where: getActiveWhatsOnWhere(),
  })

  const cards = new Map<number, BranchLandingWhatsOnCard>()

  for (const item of docs) {
    if (isWhatsOnArchived(item)) continue

    const branches = normalizeCardBranches(item.branch)
    const branchSlug = branches[0]?.slug
    if (!branchSlug) continue

    const card = mapWhatsOnToBranchLandingCard(item, branchSlug)
    if (card) cards.set(card.id, card)
  }

  return [...cards.values()]
})

type ResolvedVendorCategory = {
  id: number
  text: string
}

async function findVendorCategoryByText(
  categoryText: string,
): Promise<ResolvedVendorCategory | null> {
  const payload = await getPayloadClient()
  const trimmed = categoryText.trim()
  if (!trimmed) return null

  const { docs: exactDocs } = await payload.find({
    collection: 'vendor-categories',
    where: { text: { equals: trimmed } },
    limit: 1,
  })

  const exactMatch = exactDocs[0]
  if (exactMatch?.text) {
    return { id: exactMatch.id, text: exactMatch.text }
  }

  const { docs } = await payload.find({
    collection: 'vendor-categories',
    limit: 200,
    pagination: false,
  })

  const normalized = normalizeWhatsOnTagText(trimmed)
  const match = docs.find((doc) => doc.text && normalizeWhatsOnTagText(doc.text) === normalized)
  if (!match?.text) return null

  return { id: match.id, text: match.text }
}

export const resolveVendorCategoryByText = cache(
  async (categoryText: string): Promise<ResolvedVendorCategory | null> => {
    return findVendorCategoryByText(categoryText)
  },
)

export const getBranchVendorsForFilter = cache(
  async (branch: Branch): Promise<BranchLandingVendorCard[]> => {
    if (!branch?.id) return []

    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'vendors',
      depth: 2,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      sort: 'name',
      where: {
        branch: {
          equals: branch.id,
        },
      },
    })

    return docs.flatMap((vendor) => {
      const card = mapVendorToBranchLandingCard(vendor)
      return card ? [card] : []
    })
  },
)

export const getGlobalVendorsForFilter = cache(async (): Promise<BranchLandingVendorCard[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'vendors',
    depth: 2,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    sort: 'name',
  })

  return docs.flatMap((vendor) => {
    const card = mapVendorToBranchLandingCard(vendor)
    return card ? [card] : []
  })
})

export const GRID_CARD_PAGE_SIZE = 12

export type GridCardPageResult<T extends { id: number }> = {
  cards: T[]
  hasMore: boolean
}

export type GridCardPageFilters = {
  category?: string
  branch?: string
}

const GRID_CARD_FILTER_ALL_VALUE = 'all'

function hasActiveGridCardPageFilters(filters?: GridCardPageFilters) {
  return Boolean(
    (filters?.category && filters.category !== GRID_CARD_FILTER_ALL_VALUE) ||
    (filters?.branch && filters.branch !== GRID_CARD_FILTER_ALL_VALUE),
  )
}

function filterWhatsOnCardsForPage(
  cards: BranchLandingWhatsOnCard[],
  filters?: GridCardPageFilters,
): BranchLandingWhatsOnCard[] {
  let result = cards

  if (filters?.branch && filters.branch !== GRID_CARD_FILTER_ALL_VALUE) {
    result = result.filter((card) => card.branches.some((branch) => branch.slug === filters.branch))
  }

  if (filters?.category && filters.category !== GRID_CARD_FILTER_ALL_VALUE) {
    const normalizedCategory = filters.category.toLowerCase()
    result = result.filter((card) => {
      const mainTagMatches = card.mainTag?.toLowerCase() === normalizedCategory
      const subTagMatches = card.subTags.some((tag) => tag.toLowerCase() === normalizedCategory)

      return mainTagMatches || subTagMatches
    })
  }

  return result
}

function filterVendorCardsForPage(
  cards: BranchLandingVendorCard[],
  filters?: GridCardPageFilters,
): BranchLandingVendorCard[] {
  let result = cards

  if (filters?.branch && filters.branch !== GRID_CARD_FILTER_ALL_VALUE) {
    result = result.filter((card) => card.branches.some((branch) => branch.slug === filters.branch))
  }

  if (filters?.category && filters.category !== GRID_CARD_FILTER_ALL_VALUE) {
    const normalizedCategory = filters.category.toLowerCase()
    result = result.filter((card) =>
      card.tags.some((tag) => tag.toLowerCase() === normalizedCategory),
    )
  }

  return result
}

export const getGlobalWhatsOnForFilterPage = async (
  page = 1,
  limit = GRID_CARD_PAGE_SIZE,
  filters?: GridCardPageFilters,
): Promise<GridCardPageResult<BranchLandingWhatsOnCard>> => {
  if (hasActiveGridCardPageFilters(filters)) {
    const allCards = await getGlobalWhatsOnForFilter()
    const filtered = filterWhatsOnCardsForPage(allCards, filters)
    const start = (page - 1) * limit
    const cards = filtered.slice(start, start + limit)

    return {
      cards,
      hasMore: start + limit < filtered.length,
    }
  }

  const payload = await getPayloadClient()
  const { docs, hasNextPage } = await payload.find({
    collection: 'whats-on',
    depth: 1,
    page,
    limit,
    overrideAccess: false,
    pagination: true,
    sort: '-createdAt',
    where: getActiveWhatsOnWhere(),
  })

  const cards = docs.flatMap((item) => {
    if (isWhatsOnArchived(item)) return []

    const branches = normalizeCardBranches(item.branch)
    const branchSlug = branches[0]?.slug
    if (!branchSlug) return []

    const card = mapWhatsOnToBranchLandingCard(item, branchSlug)
    return card ? [card] : []
  })

  return {
    cards,
    hasMore: hasNextPage,
  }
}

export const getGlobalVendorsForFilterPage = async (
  page = 1,
  limit = GRID_CARD_PAGE_SIZE,
  filters?: GridCardPageFilters,
): Promise<GridCardPageResult<BranchLandingVendorCard>> => {
  const [multiBranchVendorsByName, allCards] = await Promise.all([
    getMultiBranchVendorLookup(),
    getGlobalVendorsForFilter(),
  ])
  const deduped = dedupeMultiBranchVendorCards(allCards, multiBranchVendorsByName)
  const filtered = filterVendorCardsForPage(deduped, filters)
  const start = (page - 1) * limit
  const cards = filtered.slice(start, start + limit)

  return {
    cards,
    hasMore: start + limit < filtered.length,
  }
}

function buildLifestyleVendorsWhere(lifestyleIds?: number[]) {
  if (!lifestyleIds?.length) return undefined

  return {
    or: lifestyleIds.map((id) => ({
      lifestyles: {
        contains: id,
      },
    })),
  }
}

export const getAllBranchVendorsForPage = async (
  page = 1,
  limit = BRANCH_VENDORS_PAGE_SIZE,
  lifestyleIds?: number[],
): Promise<GridCardPageResult<BranchLandingVendorCard>> => {
  const payload = await getPayloadClient()
  const lifestyleWhere = buildLifestyleVendorsWhere(lifestyleIds)

  const { docs } = await payload.find({
    collection: 'vendors',
    depth: 2,
    limit: 500,
    overrideAccess: false,
    pagination: false,
    sort: 'name',
    ...(lifestyleWhere ? { where: lifestyleWhere } : {}),
  })

  const multiBranchVendorsByName = await getMultiBranchVendorLookup()
  const allCards = docs.flatMap((vendor) => {
    const card = mapVendorToBranchLandingCard(vendor)
    return card ? [card] : []
  })
  const deduped = dedupeMultiBranchVendorCards(allCards, multiBranchVendorsByName)
  const start = (page - 1) * limit
  const cards = deduped.slice(start, start + limit)

  return {
    cards,
    hasMore: start + limit < deduped.length,
  }
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
      buttonColor: branch.footerColor?.trim() || null,
      bgColor: item.bgColor?.trim() || null,
      gallery: gallery.length ? gallery : fallbackMedia ? [fallbackMedia] : [],
      meta: item.meta,
    }
  },
)

export const getGlobalWhatsOnArchived = async (
  page = 1,
  limit = GRID_CARD_PAGE_SIZE,
): Promise<GridCardPageResult<BranchLandingWhatsOnCard>> => {
  const payload = await getPayloadClient()
  const { docs, hasNextPage } = await payload.find({
    collection: 'whats-on',
    depth: 1,
    page,
    limit,
    overrideAccess: false,
    pagination: true,
    sort: '-dateToBeArchived',
    where: getArchivedWhatsOnWhere(),
  })

  const cards = docs.flatMap((item) => {
    const branches = normalizeCardBranches(item.branch)
    const branchSlug = branches[0]?.slug
    if (!branchSlug) return []

    const card = mapWhatsOnToBranchLandingCard(item, branchSlug)
    return card ? [card] : []
  })

  return {
    cards,
    hasMore: hasNextPage,
  }
}

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
