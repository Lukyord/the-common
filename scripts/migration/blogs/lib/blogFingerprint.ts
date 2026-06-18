import crypto from 'crypto'

import type { MappedLegacyBlog } from './types.js'

function normalizeContent(html: string | null): string {
  if (!html) return ''
  return html.replace(/\s+/g, ' ').trim()
}

export function getBlogFingerprint(
  blog: Pick<MappedLegacyBlog, 'contentHtml' | 'mediaPath' | 'galleryPaths'>,
): string {
  const payload = JSON.stringify({
    content: normalizeContent(blog.contentHtml),
    media: blog.mediaPath ?? '',
    gallery: [...blog.galleryPaths].sort(),
  })

  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16)
}
