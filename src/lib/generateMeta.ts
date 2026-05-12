import type { Metadata } from 'next'

import type { Media } from '@/payload-types'
import { METADATA_FALLBACK } from '@/consts/fallback'
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

export function generateMeta({
    meta,
    fallbackTitle,
    fallbackDescription,
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

    return {
        title,
        description,
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
