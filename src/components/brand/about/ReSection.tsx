import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import RenderMedia from '@/components/common/media'
import React from 'react'

export const ReSection = () => {
  return (
    <section data-section="about-re">
      <div className="sc-inner">
        <div className="container">
          <div className="sc-header">
            <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h2"
                className="type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002"
              >
                {'ONE COMMUNITY.\nONE PLANET. ONE LOVE.'}
              </MarkdownContent>
            </AnimateOnScroll>
            <AnimateOnScroll triggerClass="fadeIn" className="sc-desc">
              <MarkdownContent as="p" className="type-d-body-m type-m-body-r letter-spacing-002">
                Discover easy ways to REUSE, RECYCLE, REFILL & REDISTRIBUTE resources at theCOMMONS.
                Small acts create meaningful impacts.
              </MarkdownContent>
            </AnimateOnScroll>
          </div>

          <div className="content">
            <div className="media-container">
              <div className="media">
                <div className="clip-hexagon-2">
                  <RenderMedia
                    src="/designs/re-1.webp"
                    alt="REUSE, RECYCLE, REFILL & REDISTRIBUTE"
                  />
                </div>
              </div>
            </div>
            <div className="trigger-wrapper"></div>
            <div className="content-desc">
              <MarkdownContent as="p" className="letter-spacing-002 type-d-body-m type-m-body-r">
                Bring your reusable cups and containers to our eateries. They&apos;ll gladly add your
                favorite treats.
              </MarkdownContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
