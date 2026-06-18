import fs from 'fs'

import { listUniqueMigrationImagePaths } from './legacyImages.js'
import type { MappedLegacyBlog } from './types.js'
import { saveMediaManifest, type MediaUploadManifest } from './blogsMedia.js'

export function cleanupBlogMediaCache(
  manifest: MediaUploadManifest,
  blogs: MappedLegacyBlog[],
  remote = false,
): number {
  const legacyPaths = listUniqueMigrationImagePaths(blogs, manifest)
  let removed = 0

  for (const legacyPath of legacyPaths) {
    const entry = manifest.entries[legacyPath]
    const webpPath = entry?.webpPath
    if (!webpPath || !fs.existsSync(webpPath)) continue

    fs.unlinkSync(webpPath)
    delete entry.webpPath
    removed += 1
  }

  saveMediaManifest(manifest, remote)
  return removed
}
