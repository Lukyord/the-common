import { LEGACY_BRANCH_TO_SLUG } from '../config/branch-map.js'
import { getBlogContentFingerprint, getBlogFingerprint } from './blogFingerprint.js'
import { createBlogSlugRegistry, resolveLegacyBlogSlug } from './blogSlugRegistry.js'
import { getBlogImagePaths } from './legacyImages.js'
import type { LegacyBlog, MappedLegacyBlog } from './types.js'
import { getLegacyId, getMigrationCutoffDate, toIsoDate } from '../../lib/legacy.js'

export function mapLegacyBlog(
  blog: LegacyBlog,
  slugRegistry: ReturnType<typeof createBlogSlugRegistry>,
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
  const contentFingerprint = getBlogContentFingerprint(contentHtml)
  const { mediaPath, galleryPaths, galleryReuseMedia } = getBlogImagePaths(blog)
  const fingerprint = getBlogFingerprint({ contentHtml, mediaPath, galleryPaths })
  const { slug, mergeBranch } = resolveLegacyBlogSlug({
    title,
    legacySlug: blog.slug,
    branchSlug,
    contentFingerprint,
    registry: slugRegistry,
  })

  if (slug !== blog.slug) {
    warnings.push(`Slug deduped: ${blog.slug} -> ${slug}`)
  }
  if (mergeBranch) {
    warnings.push(`Branch merge: ${branchSlug} -> ${slug}`)
  }

  return {
    legacyId,
    legacySlug: blog.slug,
    title,
    slug,
    fingerprint,
    contentFingerprint,
    branchSlug,
    publishedDate,
    contentHtml,
    mediaPath,
    galleryPaths,
    galleryReuseMedia,
    mergeBranch,
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
  const contentHtml = blog.content?.trim() || null
  const { mediaPath, galleryPaths, galleryReuseMedia } = getBlogImagePaths(blog)

  return {
    legacyId,
    legacySlug: blog.slug,
    title: blog.title?.trim() ?? '',
    slug: blog.slug,
    fingerprint: '',
    contentFingerprint: '',
    branchSlug: blog.branch ? (LEGACY_BRANCH_TO_SLUG[blog.branch] ?? null) : null,
    publishedDate: blog.date?.$date ? toIsoDate(new Date(blog.date.$date)) : null,
    contentHtml,
    mediaPath,
    galleryPaths,
    galleryReuseMedia,
    mergeBranch: false,
    warnings,
    skippedReason: reason,
  }
}

export function mapLegacyBlogs(
  blogs: LegacyBlog[],
  cutoff = getMigrationCutoffDate(),
): MappedLegacyBlog[] {
  const slugRegistry = createBlogSlugRegistry()
  return blogs.map((blog) => mapLegacyBlog(blog, slugRegistry, cutoff))
}

export function getEligibleBlogs(mapped: MappedLegacyBlog[]): MappedLegacyBlog[] {
  return mapped.filter((blog) => !blog.skippedReason)
}
