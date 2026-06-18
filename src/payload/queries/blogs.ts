import type { Where } from 'payload'
import { cache } from 'react'
import { notFound } from 'next/navigation'

import type { BlogCardData } from '@/components/branch/blogs/types'
import { BLOGS_PAGE_SIZE } from '@/components/branch/blogs/types'
import { normalizeCardBranches } from '@/components/branch/components/card-branch-dots'
import { getWhatsOnBranchLocationText } from '@/constants/whatsOnBranchLocations'
import { formatSingleEventDate, parseScheduleDate } from '@/lib/whatsOnEventSchedule'
import { getActiveWhatsOnWhere, isWhatsOnArchived } from '@/lib/whatsOnArchive'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Blog } from '@/payload-types'
import type { WhatsOnSingleBranch } from '@/payload/queries/branch'
import { getPayloadClient } from '@/payload/getPayloadClient'

export type BlogsPageResult = {
  cards: BlogCardData[]
  hasMore: boolean
}

export type BlogSingleData = {
  title: string
  date?: string | null
  dateToBeArchived?: string | null
  branches: WhatsOnSingleBranch[]
  content?: Blog['content'] | null
  buttonText?: string | null
  buttonLink?: string | null
  gallery: { src: string; alt: string }[]
  meta?: Blog['meta']
}

function resolveGalleryMedia(gallery?: Blog['gallery']) {
  if (!gallery?.length) return []

  return gallery.flatMap((item) => {
    const media = resolveMedia(item)
    return media ? [media] : []
  })
}

function mapBlogSingleBranches(blog: Blog): WhatsOnSingleBranch[] {
  if (!blog.branch?.length) return []

  return blog.branch.flatMap((entry) => {
    if (typeof entry === 'number' || !entry.slug) return []

    return [
      {
        slug: entry.slug,
        name: entry.name,
        location: getWhatsOnBranchLocationText(entry.slug, blog.branchLocations),
        bgColor: entry.vibesCheck?.secondaryColor?.trim() || null,
        color: entry.vibesCheck?.primaryColor?.trim() || null,
      },
    ]
  })
}

function resolveBlogGallery(blog: Blog) {
  const gallery = resolveGalleryMedia(blog.gallery)
  const fallbackMedia = resolveMedia(blog.media)

  return gallery.length ? gallery : fallbackMedia ? [fallbackMedia] : []
}

function isBlogAccessible(blog: Blog) {
  if (isWhatsOnArchived(blog)) return false

  const today = getTodayDateString()
  const publishedDate = blog.publishedDate?.trim()

  if (!publishedDate) return true

  return publishedDate <= today
}

function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getPublishedBlogsWhere(): Where {
  const today = getTodayDateString()

  return {
    or: [
      {
        publishedDate: {
          exists: false,
        },
      },
      {
        publishedDate: {
          equals: null,
        },
      },
      {
        publishedDate: {
          equals: '',
        },
      },
      {
        publishedDate: {
          less_than_equal: today,
        },
      },
    ],
  }
}

function getActiveBlogsWhere(): Where {
  return {
    and: [getActiveWhatsOnWhere(), getPublishedBlogsWhere()],
  }
}

function resolveBlogLocation(blog: Blog) {
  const branches = normalizeCardBranches(blog.branch)

  return branches
    .map((branch) => getWhatsOnBranchLocationText(branch.slug, blog.branchLocations))
    .filter((location): location is string => Boolean(location))
    .join(', ')
}

function formatPublishedDate(value?: string | null) {
  const date = parseScheduleDate(value)
  return date ? formatSingleEventDate(date) : null
}

function mapBlogToCard(blog: Blog): BlogCardData | null {
  const media = resolveMedia(blog.media)
  if (!media?.src) return null

  return {
    id: blog.id,
    title: blog.title,
    link: `/blogs/${blog.slug}`,
    media: {
      src: media.src,
      alt: media.alt || blog.title,
    },
    location: resolveBlogLocation(blog),
    date: formatPublishedDate(blog.publishedDate),
    publishedDate: blog.publishedDate ?? null,
  }
}

export async function getBlogsPage(page = 1, limit = BLOGS_PAGE_SIZE): Promise<BlogsPageResult> {
  const payload = await getPayloadClient()
  const { docs, hasNextPage } = await payload.find({
    collection: 'blogs',
    depth: 1,
    page,
    limit,
    overrideAccess: false,
    pagination: true,
    sort: '-publishedDate',
    where: getActiveBlogsWhere(),
  })

  const cards = docs.flatMap((blog) => {
    if (isWhatsOnArchived(blog)) return []

    const card = mapBlogToCard(blog)
    return card ? [card] : []
  })

  return {
    cards,
    hasMore: hasNextPage,
  }
}

export const getBlogBySlug = cache(async (slug: string): Promise<BlogSingleData> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blogs',
    where: {
      and: [{ slug: { equals: slug } }, getActiveBlogsWhere()],
    },
    depth: 2,
    limit: 1,
    overrideAccess: false,
  })

  const blog = docs[0]
  if (!blog || !isBlogAccessible(blog)) notFound()

  return {
    title: blog.title,
    date: formatPublishedDate(blog.publishedDate),
    dateToBeArchived: blog.dateToBeArchived ?? null,
    branches: mapBlogSingleBranches(blog),
    content: blog.content,
    buttonText: blog.buttonText,
    buttonLink: blog.buttonLink,
    gallery: resolveBlogGallery(blog),
    meta: blog.meta,
  }
})
