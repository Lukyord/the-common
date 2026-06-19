import Link from 'next/link'

import HorizontalMarquee from '@/components/common/horizontal-marquee'
import RenderMedia from '@/components/common/media'
import { toExternalHref } from '@/components/footer/footer-utils'
import { resolveMedia } from '@/lib/resolveMedia'
import type { About } from '@/payload-types'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

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
      <AnimateOnScroll triggerClass="fadeIn" className="kinnest-marquee">
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
      </AnimateOnScroll>

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
        <AnimateOnScroll triggerClass="fadeIn" className="logo">
          <RenderMedia src="/designs/kinnest-logo.svg" alt="Kinnest Logo" priority />
        </AnimateOnScroll>

        <AnimateOnScroll triggerClass="fadeIn" className="text">
          <div className="text-desc">
            <p className="type-d-body-l type-m-body-r  letter-spacing-002">
              A member of Kinnest Group
            </p>
          </div>

          <div className="icon">
            <i className="ic ic-arrow-square-top-right size-icon-2xs"></i>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
