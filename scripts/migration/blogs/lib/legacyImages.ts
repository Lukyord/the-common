import { GALLERY_MAX, LEGACY_S3_BASE_URL } from '../config/constants.js'
import {
  legacyPathToUrl as legacyPathToUrlShared,
  normalizeLegacyImageRef,
} from '../../lib/media/legacyPathToUrl.js'
import type { MediaUploadManifest } from './blogsMedia.js'
import type { LegacyBlog, MappedLegacyBlog } from './types.js'

export { normalizeLegacyImageRef }

export function legacyPathToUrl(path: string): string {
  return legacyPathToUrlShared(path, LEGACY_S3_BASE_URL)
}

export function uniquePaths(paths: Array<string | undefined | null>): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const path of paths) {
    if (!path?.trim()) continue
    const normalized = normalizeLegacyImageRef(path)
    if (seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
  }

  return result
}

export function getBlogImagePaths(blog: LegacyBlog): {
  mediaPath: string | null
  galleryPaths: string[]
  galleryReuseMedia: boolean
} {
  const images = uniquePaths(blog.images ?? [])
  const mediaPath = images[0] ?? null
  const galleryPaths = images.slice(0, GALLERY_MAX)
  const galleryReuseMedia = images.length === 1

  return { mediaPath, galleryPaths, galleryReuseMedia }
}

export function listUniqueMigrationImagePaths(
  blogs: MappedLegacyBlog[],
  manifest?: MediaUploadManifest | null,
): string[] {
  const paths = new Set<string>()

  for (const blog of blogs) {
    if (blog.mediaPath) paths.add(blog.mediaPath)

    const mediaHash =
      manifest && blog.mediaPath ? manifest.entries[blog.mediaPath]?.contentHash : null

    for (const legacyPath of blog.galleryPaths) {
      if (legacyPath === blog.mediaPath) continue
      if (mediaHash && manifest?.entries[legacyPath]?.contentHash === mediaHash) continue
      paths.add(legacyPath)
    }
  }

  return [...paths]
}
