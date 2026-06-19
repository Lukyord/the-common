import type { Payload } from 'payload'

import type { Blog } from '@/payload-types'

import type { MediaUploadManifest } from './blogsMedia.js'
import { getContentFingerprintFromManifest } from './blogsMedia.js'
import type { MappedLegacyBlog } from './types.js'

export type BlogImportResolution = {
  slug: string
  mergeIntoId: number | null
}

async function isSlugTaken(
  payload: Payload,
  slug: string,
  reservedSlugs: Set<string>,
): Promise<boolean> {
  if (reservedSlugs.has(slug)) return true

  const { docs } = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: slug } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  return docs.length > 0
}

async function findAvailableSlug(
  payload: Payload,
  baseSlug: string,
  branchSlug: string | null,
  legacyId: string,
  reservedSlugs: Set<string>,
): Promise<string> {
  const usedSlugs = new Set(reservedSlugs)

  async function takeSlug(slug: string): Promise<string | null> {
    if (usedSlugs.has(slug)) return null
    if (await isSlugTaken(payload, slug, usedSlugs)) return null
    usedSlugs.add(slug)
    return slug
  }

  if (await takeSlug(baseSlug)) return baseSlug

  if (branchSlug) {
    let candidate = `${baseSlug}-${branchSlug}`
    if (await takeSlug(candidate)) return candidate

    let index = 2
    while (index < 100) {
      candidate = `${baseSlug}-${branchSlug}-${index}`
      if (await takeSlug(candidate)) return candidate
      index += 1
    }
  }

  let candidate = `${baseSlug}-${legacyId.slice(-6)}`
  if (await takeSlug(candidate)) return candidate

  let index = 2
  while (index < 100) {
    candidate = `${baseSlug}-${legacyId.slice(-6)}-${index}`
    if (await takeSlug(candidate)) return candidate
    index += 1
  }

  throw new Error(`Could not allocate slug for ${baseSlug}`)
}

function getBlogBranchIds(branch: unknown): number[] {
  if (!Array.isArray(branch)) return []

  return branch
    .map((entry) => {
      if (typeof entry === 'number') return entry
      if (entry && typeof entry === 'object' && 'id' in entry) {
        const id = (entry as { id?: unknown }).id
        return typeof id === 'number' ? id : null
      }
      return null
    })
    .filter((id): id is number => typeof id === 'number')
}

function contentFingerprintMatches(
  manifest: MediaUploadManifest | null,
  existing: Blog,
  contentFingerprint: string,
): boolean {
  const stored = manifest ? getContentFingerprintFromManifest(manifest, existing.slug) : null
  return stored === contentFingerprint
}

export async function resolveBlogImport(
  blog: MappedLegacyBlog,
  payload: Payload,
  manifest: MediaUploadManifest | null,
): Promise<BlogImportResolution> {
  const reservedSlugs = new Set(Object.keys(manifest?.slugFingerprints ?? {}))

  const { docs: sameTitleDocs } = await payload.find({
    collection: 'blogs',
    where: { title: { equals: blog.title } },
    limit: 20,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  for (const doc of sameTitleDocs as Blog[]) {
    if (contentFingerprintMatches(manifest, doc, blog.contentFingerprint)) {
      return { slug: doc.slug, mergeIntoId: doc.id }
    }
  }

  if (sameTitleDocs.length > 0) {
    const baseSlug = blog.legacySlug
    const slug = await findAvailableSlug(
      payload,
      baseSlug,
      blog.branchSlug,
      blog.legacyId,
      reservedSlugs,
    )
    return { slug, mergeIntoId: null }
  }

  const { docs: slugDocs } = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: blog.slug } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  if (slugDocs[0]) {
    const existing = slugDocs[0] as Blog
    const storedFingerprint = manifest?.slugFingerprints?.[existing.slug]
    if (storedFingerprint && storedFingerprint === blog.fingerprint) {
      return { slug: existing.slug, mergeIntoId: existing.id }
    }

    const slug = await findAvailableSlug(
      payload,
      blog.slug,
      blog.branchSlug,
      blog.legacyId,
      reservedSlugs,
    )
    return { slug, mergeIntoId: null }
  }

  const slug = await findAvailableSlug(
    payload,
    blog.slug,
    blog.branchSlug,
    blog.legacyId,
    reservedSlugs,
  )

  return { slug, mergeIntoId: null }
}

export { getBlogBranchIds }
