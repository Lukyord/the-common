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

const PRIORITY = {
  home: 1,
  section: 0.8,
  page: 0.64,
} as const

function addEntry(
  entries: Map<string, SitemapEntry>,
  path: string,
  options: { lastmod?: string | null; priority: number },
) {
  const loc = getAbsoluteUrl(path)
  const formattedLastmod = formatLastmod(options.lastmod)
  const existing = entries.get(loc)

  const entry: SitemapEntry = {
    loc,
    priority: options.priority,
    ...(formattedLastmod ? { lastmod: formattedLastmod } : {}),
  }

  if (!existing) {
    entries.set(loc, entry)
    return
  }

  if (formattedLastmod && (!existing.lastmod || formattedLastmod > existing.lastmod)) {
    entries.set(loc, { ...existing, lastmod: formattedLastmod })
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

const BRAND_STATIC_PATHS: { path: string; priority: number }[] = [
  { path: '/', priority: PRIORITY.home },
  { path: '/about', priority: PRIORITY.section },
  { path: '/contact', priority: PRIORITY.section },
  { path: '/vendors', priority: PRIORITY.section },
  { path: '/whats-on', priority: PRIORITY.section },
  { path: '/whats-on/archive', priority: PRIORITY.page },
  { path: '/blogs', priority: PRIORITY.section },
  { path: '/venue-rental', priority: PRIORITY.section },
  { path: '/privacy-policy', priority: PRIORITY.page },
]

const BRANCH_STATIC_PATHS: { suffix: string; priority: number }[] = [
  { suffix: '', priority: PRIORITY.section },
  { suffix: '/contact', priority: PRIORITY.section },
  { suffix: '/vendors', priority: PRIORITY.section },
  { suffix: '/whats-on', priority: PRIORITY.section },
  { suffix: '/whats-on/archive', priority: PRIORITY.page },
  { suffix: '/venue-rental', priority: PRIORITY.section },
]

export async function collectSitemapUrls(payload: Payload): Promise<SitemapEntry[]> {
  const entries = new Map<string, SitemapEntry>()
  const generatedAt = new Date().toISOString()

  for (const { path, priority } of BRAND_STATIC_PATHS) {
    addEntry(entries, path, { lastmod: generatedAt, priority })
  }

  const branches = await findAllDocs(payload, 'branches', {
    depth: 0,
    sort: 'createdAt',
  })

  for (const branch of branches) {
    if (!branch.slug) continue

    for (const { suffix, priority } of BRANCH_STATIC_PATHS) {
      addEntry(entries, `/${branch.slug}${suffix}`, { lastmod: branch.updatedAt, priority })
    }
  }

  const vendors = await findAllDocs(payload, 'vendors', {
    depth: 1,
    sort: 'updatedAt',
  })

  for (const vendor of vendors) {
    if (!vendor.slug) continue

    const branchSlug = getVendorBranchSlug(vendor)
    if (!branchSlug) continue

    addEntry(entries, `/${branchSlug}/vendors/${vendor.slug}`, {
      lastmod: vendor.updatedAt,
      priority: PRIORITY.page,
    })
  }

  const whatsOnItems = await findAllDocs(payload, 'whats-on', {
    where: getActiveWhatsOnWhere(),
    depth: 1,
    sort: '-updatedAt',
  })

  for (const item of whatsOnItems) {
    if (!item.slug) continue

    for (const branchSlug of getBranchSlugs(item.branch)) {
      addEntry(entries, `/${branchSlug}/whats-on/${item.slug}`, {
        lastmod: item.updatedAt,
        priority: PRIORITY.page,
      })
    }
  }

  const blogs = await findAllDocs(payload, 'blogs', {
    where: getActiveBlogsWhere(),
    depth: 0,
    sort: '-updatedAt',
  })

  for (const blog of blogs) {
    if (!blog.slug) continue
    addEntry(entries, `/blogs/${blog.slug}`, { lastmod: blog.updatedAt, priority: PRIORITY.page })
  }

  return [...entries.values()].sort((a, b) => a.loc.localeCompare(b.loc))
}
