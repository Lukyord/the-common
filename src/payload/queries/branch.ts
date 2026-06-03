import { cache } from 'react'
import { notFound } from 'next/navigation'

import { WHATS_ON_MAIN_TAGS, WHATS_ON_SUB_TAGS } from '@/constants/whatsOnTags'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Branch, Vendor, WhatsOn } from '@/payload-types'
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

const BRANCH_VENDOR_LIMIT = 3

export type BranchLandingVendorCard = {
  id: number
  title: string
  link: string
  media: {
    src: string
    alt: string
  }
  tags: string[]
  location: string
}

function mapVendorToBranchLandingCard(vendor: Vendor): BranchLandingVendorCard | null {
  const media = resolveMedia(vendor.media)
  const branch = typeof vendor.branch === 'object' ? vendor.branch : null

  if (!media?.src || !branch?.slug) return null

  const categoryText =
    typeof vendor.category === 'object' && vendor.category?.text ? vendor.category.text : undefined
  const tags = categoryText ? [categoryText] : []
  const location = vendor.floorLocation ?? ''

  return {
    id: vendor.id,
    title: vendor.name,
    link: `/${branch.slug}/vendor/${vendor.slug}`,
    media: {
      src: media.src,
      alt: media.alt || vendor.name,
    },
    tags,
    location,
  }
}

export const getBranchLandingVendors = cache(async (branch: Branch): Promise<BranchLandingVendorCard[]> => {
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
})

const BRANCH_WHATS_ON_LIMIT = 3

export type BranchLandingWhatsOnCard = {
  id: number
  title: string
  link: string
  media: {
    src: string
    alt: string
  }
  date?: string | null
  time?: string | null
  mainTag?: string | null
  subTags: string[]
  highlightText?: string | null
}

function getWhatsOnMainTagText(tagId: WhatsOn['mainTag']) {
  if (!tagId) return null
  return WHATS_ON_MAIN_TAGS.find((tag) => tag.id === tagId)?.text ?? null
}

function getWhatsOnSubTagTexts(tagIds: WhatsOn['subTags']) {
  if (!tagIds?.length) return []

  return tagIds.flatMap((tagId) => {
    const text = WHATS_ON_SUB_TAGS.find((tag) => tag.id === tagId)?.text
    return text ? [text] : []
  })
}

function isWhatsOnArchived(item: WhatsOn) {
  if (!item.dateToBeArchived) return false
  const archiveDate = new Date(item.dateToBeArchived)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  archiveDate.setHours(0, 0, 0, 0)
  return archiveDate <= today
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
    link: `/${branchSlug}/event/${item.slug}`,
    media: {
      src: media.src,
      alt: media.alt || item.title,
    },
    date: item.date,
    time: item.time,
    mainTag: getWhatsOnMainTagText(item.mainTag),
    subTags: getWhatsOnSubTagTexts(item.subTags),
    highlightText: highlightText ?? null,
  }
}

const activeWhatsOnWhere = {
  or: [
    {
      dateToBeArchived: {
        exists: false,
      },
    },
    {
      dateToBeArchived: {
        greater_than: new Date().toISOString().split('T')[0],
      },
    },
  ],
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
