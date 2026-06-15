import type { Payload } from 'payload'

import type { MappedLegacyEvent } from './types.js'
import {
  getContentHashFromManifest,
  getMediaIdFromManifest,
  type MediaUploadManifest,
} from './eventsMedia.js'

export async function resolveGalleryMediaIds(
  payload: Payload | null,
  event: Pick<MappedLegacyEvent, 'galleryPaths' | 'galleryReuseMedia' | 'mediaPath'>,
  manifest: MediaUploadManifest | null,
  mediaId: number | null,
): Promise<number[]> {
  if (event.galleryReuseMedia && mediaId) {
    return [mediaId]
  }

  if (!manifest) return []

  const mediaContentHash = getContentHashFromManifest(manifest, event.mediaPath)
  const galleryPaths = event.galleryPaths.filter((legacyPath) => {
    if (!mediaContentHash) return true
    const galleryHash = getContentHashFromManifest(manifest, legacyPath)
    return !galleryHash || galleryHash !== mediaContentHash
  })

  const galleryIds = await Promise.all(
    galleryPaths.map(async (legacyPath) => {
      const galleryMediaId = getMediaIdFromManifest(manifest, legacyPath)
      if (!galleryMediaId || !payload) return galleryMediaId

      try {
        await payload.findByID({
          collection: 'media',
          id: galleryMediaId,
          overrideAccess: true,
        })
        return galleryMediaId
      } catch {
        return null
      }
    }),
  )

  return galleryIds.filter((id): id is number => typeof id === 'number')
}
