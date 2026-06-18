import { LEGACY_BRANCH_TO_SLUG } from '../config/branch-map.js'
import { getBlogFingerprint } from './blogFingerprint.js'
import { getBlogImagePaths } from './legacyImages.js'
import type { LegacyBlog, MappedLegacyBlog } from './types.js'
import { getLegacyId, getMigrationCutoffDate, toIsoDate } from '../../lib/legacy.js'
import {
  createLegacySlugRegistry,
  resolveLegacyEventSlug,
  resolveUniqueSlug,
  type LegacySlugRegistry,
} from '../../lib/slugRegistry.js'

function resolveBlogSlug(
  legacySlug: string,
  branchSlug: string | null,
  legacyId: string,
  fingerprint: string,
  registry: LegacySlugRegistry,
): string {
  if (!branchSlug) {
    return resolveUniqueSlug(legacySlug, legacyId, registry.assignedSlugs)
  }

  return resolveLegacyEventSlug(legacySlug, branchSlug, legacyId, fingerprint, registry)
}

export function mapLegacyBlog(
  blog: LegacyBlog,
  slugRegistry: LegacySlugRegistry,
  cutoff = getMigrationCutoffDate(),
): MappedLegacyBlog {
  const legacyId = getLegacyId(blog)
  const warnings: string[] = []

  if (blog.isDelete) {
    return buildSkipped(blog, legacyId, 'Marked as deleted', warnings)
  }

  const title = blog.title?.trim()
  if (!title) {
    return buildSkipped(blog, legacyId, 'Missing title', warnings)
  }

  let branchSlug: string | null = null
  if (blog.branch?.trim()) {
    branchSlug = LEGACY_BRANCH_TO_SLUG[blog.branch] ?? null
    if (!branchSlug) {
      warnings.push(`Unknown branch: ${blog.branch}`)
    }
  }

  const publishedAt = blog.date?.$date ? new Date(blog.date.$date) : null
  const publishedDate = publishedAt ? toIsoDate(publishedAt) : null

  if (!publishedAt) {
    return buildSkipped(blog, legacyId, 'Missing published date', warnings)
  }

  if (publishedAt < cutoff) {
    return buildSkipped(
      blog,
      legacyId,
      `Published date ${publishedDate} is before cutoff ${toIsoDate(cutoff)}`,
      warnings,
    )
  }

  const contentHtml = blog.content?.trim() || null
  const { mediaPath, galleryPaths, galleryReuseMedia } = getBlogImagePaths(blog)
  const fingerprint = getBlogFingerprint({ contentHtml, mediaPath, galleryPaths })
  const slug = resolveBlogSlug(blog.slug, branchSlug, legacyId, fingerprint, slugRegistry)

  if (slug !== blog.slug) {
    warnings.push(`Slug deduped: ${blog.slug} -> ${slug}`)
  }

  return {
    legacyId,
    legacySlug: blog.slug,
    title,
    slug,
    fingerprint,
    branchSlug,
    publishedDate,
    contentHtml,
    mediaPath,
    galleryPaths,
    galleryReuseMedia,
    warnings,
    skippedReason: null,
  }
}

function buildSkipped(
  blog: LegacyBlog,
  legacyId: string,
  reason: string,
  warnings: string[] = [],
): MappedLegacyBlog {
  const { mediaPath, galleryPaths, galleryReuseMedia } = getBlogImagePaths(blog)

  return {
    legacyId,
    legacySlug: blog.slug,
    title: blog.title?.trim() ?? '',
    slug: blog.slug,
    fingerprint: '',
    branchSlug: blog.branch ? (LEGACY_BRANCH_TO_SLUG[blog.branch] ?? null) : null,
    publishedDate: blog.date?.$date ? toIsoDate(new Date(blog.date.$date)) : null,
    contentHtml: blog.content?.trim() || null,
    mediaPath,
    galleryPaths,
    galleryReuseMedia,
    warnings,
    skippedReason: reason,
  }
}

export function mapLegacyBlogs(
  blogs: LegacyBlog[],
  cutoff = getMigrationCutoffDate(),
): MappedLegacyBlog[] {
  const slugRegistry = createLegacySlugRegistry()
  return blogs.map((blog) => mapLegacyBlog(blog, slugRegistry, cutoff))
}

export function getEligibleBlogs(mapped: MappedLegacyBlog[]): MappedLegacyBlog[] {
  return mapped.filter((blog) => !blog.skippedReason)
}
