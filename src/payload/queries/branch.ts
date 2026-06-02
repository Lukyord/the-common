import { cache } from 'react'
import { notFound } from 'next/navigation'

import { resolveMedia } from '@/lib/resolveMedia'
import type { Branch, Vendor } from '@/payload-types'
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
