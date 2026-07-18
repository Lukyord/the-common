import type { Metadata } from 'next'

import type { Media } from '@/payload-types'
import { METADATA_FALLBACK } from '@/constants/fallback'
import { getAbsoluteUrl } from './url'

type PayloadMeta =
  | {
      title?: string | null
      description?: string | null
      image?: number | Media | null
    }
  | null
  | undefined

interface GenerateMetaArgs {
  meta?: PayloadMeta
  fallbackTitle?: string | null
  fallbackDescription?: string | null
  /** Self-canonical path, e.g. `/vendors` or `/{branch}/vendors/{slug}` */
  pathname?: string
  /** Override canonical when it differs from the page URL (e.g. brand → branch vendor) */
  canonicalPath?: string
  robots?: Metadata['robots']
}

function resolveImage(
  image: PayloadMeta['image'],
): { url: string; alt?: string | null } | undefined {
  if (!image || typeof image === 'number') {
    return undefined
  }

  const media = image as Media

  if (!media.url) {
    return undefined
  }

  return {
    url: getAbsoluteUrl(media.url),
    alt: media.alt,
  }
}

function normalizePath(path: string): string {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function generateMeta({
  meta,
  fallbackTitle,
  fallbackDescription,
  pathname,
  canonicalPath,
  robots,
}: GenerateMetaArgs = {}): Metadata {
  const title = meta?.title?.trim() || fallbackTitle?.trim() || METADATA_FALLBACK.title
  const description =
    meta?.description?.trim() || fallbackDescription?.trim() || METADATA_FALLBACK.description

  const ogTitle = title || METADATA_FALLBACK.ogTitle
  const ogDescription = description || METADATA_FALLBACK.ogDescription

  const resolvedImage = resolveImage(meta?.image)
  const openGraphImages = resolvedImage
    ? [
        {
          url: resolvedImage.url,
          alt: resolvedImage.alt || title,
        },
      ]
    : METADATA_FALLBACK.ogImage
      ? [
          {
            url: METADATA_FALLBACK.ogImage,
            alt: title,
          },
        ]
      : undefined

  const twitterImages = openGraphImages?.map((image) => image.url)

  const canonical = canonicalPath ?? pathname

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical: normalizePath(canonical) } } : {}),
    ...(robots !== undefined ? { robots } : {}),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: openGraphImages,
    },
    twitter: {
      card: twitterImages ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description: ogDescription,
      images: twitterImages,
    },
  }
}
