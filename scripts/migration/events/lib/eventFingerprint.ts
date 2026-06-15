import crypto from 'crypto'

import type { MappedLegacyEvent } from './types.js'

function normalizeContent(html: string | null): string {
  if (!html) return ''
  return html.replace(/\s+/g, ' ').trim()
}

export function getEventFingerprint(
  event: Pick<MappedLegacyEvent, 'contentHtml' | 'mediaPath' | 'galleryPaths'>,
): string {
  const payload = JSON.stringify({
    content: normalizeContent(event.contentHtml),
    media: event.mediaPath ?? '',
    gallery: [...event.galleryPaths].sort(),
  })

  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16)
}
