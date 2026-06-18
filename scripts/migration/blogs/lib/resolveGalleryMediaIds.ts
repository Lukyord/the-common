import type { Payload } from 'payload'

import type { MappedLegacyBlog } from './types.js'
import { getMediaIdFromManifest, type MediaUploadManifest } from './blogsMedia.js'

export async function resolveBlogGalleryMediaIds(
  payload: Payload | null,
  blog: Pick<MappedLegacyBlog, 'galleryPaths' | 'galleryReuseMedia' | 'mediaPath'>,
  manifest: MediaUploadManifest | null,
  mediaId: number | null,
): Promise<number[]> {
  if (blog.galleryReuseMedia && mediaId) {
    return [mediaId]
  }

  if (!manifest) return []

  const galleryIds: number[] = []

  for (const legacyPath of blog.galleryPaths) {
    if (legacyPath === blog.mediaPath) {
      if (mediaId) galleryIds.push(mediaId)
      continue
    }

    const galleryMediaId = getMediaIdFromManifest(manifest, legacyPath)
    if (!galleryMediaId) continue

    if (!payload) {
      galleryIds.push(galleryMediaId)
      continue
    }

    try {
      await payload.findByID({
        collection: 'media',
        id: galleryMediaId,
        overrideAccess: true,
      })
      galleryIds.push(galleryMediaId)
    } catch {
      // stale manifest entry
    }
  }

  return galleryIds
}
