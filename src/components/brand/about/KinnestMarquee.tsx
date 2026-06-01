import Link from 'next/link'

import HorizontalMarquee from '@/components/common/horizontal-marquee'
import RenderMedia from '@/components/common/media'
import { toExternalHref } from '@/components/footer/footer-utils'
import { resolveMedia } from '@/lib/resolveMedia'
import type { About } from '@/payload-types'

export type KinnestMarqueeItem = {
  id?: string | null
  media: NonNullable<ReturnType<typeof resolveMedia>>
}

export type KinnestMarqueeData = {
  items: KinnestMarqueeItem[]
  kinnestLink?: string | null
}

export function toKinnestMarqueeData(
  kinnestMarquee?: About['kinnestMarquee'] | null,
  kinnestGroup?: string | null,
): KinnestMarqueeData {
  const items =
    kinnestMarquee?.media?.flatMap((item): KinnestMarqueeItem[] => {
      const media = resolveMedia(item.media)
      if (!media) return []
      return [{ id: item.id, media }]
    }) ?? []

  return { items, kinnestLink: kinnestGroup }
}

type KinnestMarqueeProps = KinnestMarqueeData

export default function KinnestMarquee({ items, kinnestLink }: KinnestMarqueeProps) {
  const kinnestHref = toExternalHref(kinnestLink)

  return (
    <section data-section="kinnest-marquee">
      <div className="kinnest-marquee">
        <HorizontalMarquee speed={50} direction="left">
          <div className="kinnest-marquee__strip">
            {items.map((item, index) => (
              <div
                key={item.id ?? index}
                className="kinnest-marquee__item"
                data-shape={(index % 6) + 1}
              >
                <div className={`clip-about-shape-${(index % 6) + 1}`}>
                  <RenderMedia src={item.media.src} alt={item.media.alt} priority />
                </div>
              </div>
            ))}
          </div>
        </HorizontalMarquee>
      </div>

      <div className="kinnest-cta">
        {kinnestHref && (
          <Link
            href={kinnestHref}
            className="link-overlay"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Kinnest Group"
          >
            &nbsp;
          </Link>
        )}
        <div className="logo">
          <RenderMedia src="/designs/kinnest-logo.svg" alt="Kinnest Logo" priority />
        </div>

        <div className="text">
          <div className="text-desc">
            <p className="type-d-body-l type-m-title letter-spacing-002">
              A member of Kinnest Group
            </p>
          </div>

          <div className="icon">
            <i className="ic ic-arrow-square-top-right size-icon-2xs"></i>
          </div>
        </div>
      </div>
    </section>
  )
}
