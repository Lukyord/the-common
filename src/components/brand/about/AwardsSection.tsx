import Link from 'next/link'

import HorizontalMarquee from '@/components/common/horizontal-marquee'
import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import { resolveMedia } from '@/lib/resolveMedia'
import type { About } from '@/payload-types'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

export type AwardMarqueeItem = {
  id?: string | null
  link?: string | null
  media: NonNullable<ReturnType<typeof resolveMedia>>
}

export type AwardsSectionData = {
  title?: string | null
  main: AwardMarqueeItem[]
  secondary: AwardMarqueeItem[]
}

export function toAwardsData(awards?: About['awards'] | null): AwardsSectionData {
  const main =
    awards?.mediaWithLink?.flatMap((item): AwardMarqueeItem[] => {
      const media = resolveMedia(item.media)
      if (!media) return []
      return [{ id: item.id, link: item.link, media }]
    }) ?? []

  const secondary =
    awards?.media?.flatMap((item): AwardMarqueeItem[] => {
      const media = resolveMedia(item.media)
      if (!media) return []
      return [{ id: item.id, media }]
    }) ?? []

  return { title: awards?.title, main, secondary }
}

type AwardsSectionProps = AwardsSectionData

export function AwardsSection({ title, main, secondary }: AwardsSectionProps) {
  return (
    <section data-section="awards" className="bg-beige">
      <div className="sc-inner pc-t-100 pc-b-100 mb-t-75 mb-b-75">
        <div className="container">
          <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
            <MarkdownContent
              as="h2"
              className="type-d-header type-m-headliner-m weight-medium uppercase letter-spacing-002"
            >
              {title}
            </MarkdownContent>
          </AnimateOnScroll>

          <AnimateOnScroll triggerClass="fadeIn" className="award-marquee">
            <HorizontalMarquee speed={25} direction="left">
              <div className="award-marquee__strip">
                {main.map((item, index) => (
                  <div key={item.id ?? index} className="award-marquee__item main">
                    {item.link && (
                      <Link href={item.link} className="link-overlay" aria-label={item.media.alt}>
                        &nbsp;
                      </Link>
                    )}
                    <RenderMedia src={item.media.src} alt={item.media.alt} priority />
                  </div>
                ))}
              </div>
            </HorizontalMarquee>

            <HorizontalMarquee speed={25} direction="right">
              <div className="award-marquee__strip">
                {secondary.map((item, index) => (
                  <div key={item.id ?? index} className="award-marquee__item secondary">
                    <RenderMedia src={item.media.src} alt={item.media.alt} priority />
                  </div>
                ))}
              </div>
            </HorizontalMarquee>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
