import type { CSSProperties } from 'react'

import type { Branch } from '@/payload-types'
import { resolveMedia } from '@/lib/resolveMedia'
import RenderMedia from '@/components/common/media'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'

type AboutSectionProps = {
  data?: Branch['about'] | null
}

export default function AboutSection({ data }: AboutSectionProps) {
  const background = resolveMedia(data?.backgroundMedia)
  const backgroundMobile = resolveMedia(data?.mobileBackgroundMedia)
  const hasContent = Boolean(data?.title || data?.description || background?.src)

  if (!hasContent) return null

  return (
    <section
      data-section="about-section"
      className="branch-about"
      style={data?.bgColor ? ({ '--about-bg-color': data.bgColor } as CSSProperties) : undefined}
    >
      <div className="sc-inner pc-t-75 pc-b-75 mb-t-75 mb-b-75">
        <div className="container">
          <div className="media-content">
            <AnimateOnScroll triggerClass="fadeIn" className="media">
              {background?.src && (
                <div className="cover">
                  <RenderMedia
                    src={background.src}
                    srcMobile={backgroundMobile?.src || background.src}
                    alt={background.alt}
                  />
                </div>
              )}
            </AnimateOnScroll>
            <div className="words"></div>
          </div>
          <div className="sc-header">
            {data?.title && (
              <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
                <MarkdownContent
                  as="h2"
                  className="type-d-header type-m-headliner-m weight-medium letter-spacing-002"
                >
                  {data.title}
                </MarkdownContent>
              </AnimateOnScroll>
            )}
            {data?.description && (
              <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-desc">
                <MarkdownContent as="p" className="type-d-body-m type-m-body-s letter-spacing-002">
                  {data.description}
                </MarkdownContent>
              </AnimateOnScroll>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
