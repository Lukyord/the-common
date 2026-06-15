import fs from 'fs'

import { listUniqueMigrationImagePaths } from './legacyImages.js'
import type { MappedLegacyEvent } from './types.js'
import { saveMediaManifest, type MediaUploadManifest } from './eventsMedia.js'

export function cleanupEventMediaCache(
  manifest: MediaUploadManifest,
  events: MappedLegacyEvent[],
): number {
  const legacyPaths = listUniqueMigrationImagePaths(events, manifest)
  let removed = 0

  for (const legacyPath of legacyPaths) {
    const entry = manifest.entries[legacyPath]
    const webpPath = entry?.webpPath
    if (!webpPath || !fs.existsSync(webpPath)) continue

    fs.unlinkSync(webpPath)
    delete entry.webpPath
    removed += 1
  }

  saveMediaManifest(manifest)
  return removed
}
