import type { Media } from '@/payload-types'

export function resolveMedia(media?: (number | null) | Media) {
  if (!media || typeof media === 'number' || !media.url) {
    return undefined
  }

  return { src: media.url, alt: media.alt ?? '' }
}
