import { GALLERY_MAX, LEGACY_S3_BASE_URL } from '../config/constants.js'
import {
  legacyPathToUrl as legacyPathToUrlShared,
  normalizeLegacyImageRef,
} from '../../lib/media/legacyPathToUrl.js'
import type { MediaUploadManifest } from './eventsMedia.js'
import type { LegacyEvent, MappedLegacyEvent } from './types.js'

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

export function getEventImagePaths(event: LegacyEvent): {
  mediaPath: string | null
  galleryPaths: string[]
  galleryReuseMedia: boolean
} {
  const imagePath = event.imagePath?.trim() || null
  const coverImagePath = event.coverImagePath?.trim() || null
  const images = uniquePaths(event.images ?? [])
  const cardMediaPath = imagePath ?? coverImagePath ?? null

  const mediaPath = cardMediaPath ?? images[0] ?? null

  // Gallery: first 5 from images[], never re-upload the card image path.
  let galleryPaths = images
    .filter((path) => path !== mediaPath)
    .slice(0, GALLERY_MAX)

  // Legacy often stores imagePath (card) plus a single images[] entry for the same event.
  // Upload the card image once; gallery reuses that media record at import.
  const galleryReuseMedia = Boolean(cardMediaPath && images.length === 1)

  if (galleryReuseMedia) {
    galleryPaths = []
  } else if (!cardMediaPath && mediaPath) {
    // No card path — media is images[0]; gallery is the remaining images only.
    galleryPaths = images.slice(1, GALLERY_MAX + 1)
  }

  return { mediaPath, galleryPaths, galleryReuseMedia }
}

export function listUniqueMigrationImagePaths(
  events: MappedLegacyEvent[],
  manifest?: MediaUploadManifest | null,
): string[] {
  const paths = new Set<string>()

  for (const event of events) {
    if (event.mediaPath) paths.add(event.mediaPath)

    const mediaHash = manifest && event.mediaPath
      ? manifest.entries[event.mediaPath]?.contentHash
      : null

    for (const path of event.galleryPaths) {
      if (mediaHash && manifest?.entries[path]?.contentHash === mediaHash) continue
      paths.add(path)
    }
  }

  return [...paths]
}
