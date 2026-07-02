import type { Payload, Where } from 'payload'

import { getActiveWhatsOnWhere } from '@/lib/whatsOnArchive'
import type { SitemapEntry } from '@/lib/sitemap/types'
import { getAbsoluteUrl } from '@/lib/url'
import type { Blog, Branch, Vendor, WhatsOn } from '@/payload-types'

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
      { publishedDate: { exists: false } },
      { publishedDate: { equals: null } },
      { publishedDate: { equals: '' } },
      { publishedDate: { less_than_equal: today } },
    ],
  }
}

function getActiveBlogsWhere(): Where {
  return {
    and: [getActiveWhatsOnWhere(), getPublishedBlogsWhere()],
  }
}

function formatLastmod(value?: string | null) {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toISOString().split('T')[0]
}

function addEntry(entries: Map<string, SitemapEntry>, path: string, lastmod?: string | null) {
  const loc = getAbsoluteUrl(path)
  const formattedLastmod = formatLastmod(lastmod)
  const existing = entries.get(loc)

  if (!existing) {
    entries.set(loc, formattedLastmod ? { loc, lastmod: formattedLastmod } : { loc })
    return
  }

  if (formattedLastmod && (!existing.lastmod || formattedLastmod > existing.lastmod)) {
    entries.set(loc, { loc, lastmod: formattedLastmod })
  }
}

function getBranchSlugs(branch: WhatsOn['branch'] | Blog['branch']) {
  if (!branch?.length) return []

  return branch.flatMap((entry) => {
    if (typeof entry === 'number' || !entry.slug) return []
    return [entry.slug]
  })
}

function getVendorBranchSlug(vendor: Vendor) {
  if (typeof vendor.branch === 'object' && vendor.branch?.slug) {
    return vendor.branch.slug
  }

  return null
}

type SitemapCollectionMap = {
  branches: Branch
  vendors: Vendor
  'whats-on': WhatsOn
  blogs: Blog
}

type SitemapCollectionSlug = keyof SitemapCollectionMap

async function findAllDocs<TSlug extends SitemapCollectionSlug>(
  payload: Payload,
  collection: TSlug,
  options: {
    where?: Where
    depth?: number
    sort?: string
  } = {},
): Promise<SitemapCollectionMap[TSlug][]> {
  const limit = 250
  let page = 1
  const docs: SitemapCollectionMap[TSlug][] = []

  while (true) {
    const result = await payload.find({
      collection,
      where: options.where,
      depth: options.depth ?? 0,
      sort: options.sort,
      limit,
      page,
      pagination: true,
      overrideAccess: true,
    })

    docs.push(...(result.docs as SitemapCollectionMap[TSlug][]))

    if (!result.hasNextPage) break
    page += 1
  }

  return docs
}

const BRAND_STATIC_PATHS = [
  '/',
  '/about',
  '/contact',
  '/vendors',
  '/vendors/filter',
  '/whats-on',
  '/whats-on/filter',
  '/whats-on/archive',
  '/blogs',
  '/venue-rental',
  '/privacy-policy',
] as const

const BRANCH_STATIC_PATHS = [
  '',
  '/contact',
  '/vendors',
  '/whats-on',
  '/whats-on/archive',
  '/venue-rental',
] as const

export async function collectSitemapUrls(payload: Payload): Promise<SitemapEntry[]> {
  const entries = new Map<string, SitemapEntry>()
  const generatedAt = new Date().toISOString()

  for (const path of BRAND_STATIC_PATHS) {
    addEntry(entries, path, generatedAt)
  }

  const branches = await findAllDocs(payload, 'branches', {
    depth: 0,
    sort: 'createdAt',
  })

  for (const branch of branches) {
    if (!branch.slug) continue

    for (const suffix of BRANCH_STATIC_PATHS) {
      addEntry(entries, `/${branch.slug}${suffix}`, branch.updatedAt)
    }
  }

  const vendors = await findAllDocs(payload, 'vendors', {
    depth: 1,
    sort: 'updatedAt',
  })

  for (const vendor of vendors) {
    if (!vendor.slug) continue

    addEntry(entries, `/vendors/${vendor.slug}`, vendor.updatedAt)

    const branchSlug = getVendorBranchSlug(vendor)
    if (branchSlug) {
      addEntry(entries, `/${branchSlug}/vendors/${vendor.slug}`, vendor.updatedAt)
    }
  }

  const whatsOnItems = await findAllDocs(payload, 'whats-on', {
    where: getActiveWhatsOnWhere(),
    depth: 1,
    sort: '-updatedAt',
  })

  for (const item of whatsOnItems) {
    if (!item.slug) continue

    for (const branchSlug of getBranchSlugs(item.branch)) {
      addEntry(entries, `/${branchSlug}/whats-on/${item.slug}`, item.updatedAt)
    }
  }

  const blogs = await findAllDocs(payload, 'blogs', {
    where: getActiveBlogsWhere(),
    depth: 0,
    sort: '-updatedAt',
  })

  for (const blog of blogs) {
    if (!blog.slug) continue
    addEntry(entries, `/blogs/${blog.slug}`, blog.updatedAt)
  }

  return [...entries.values()].sort((a, b) => a.loc.localeCompare(b.loc))
}
