import type { CSSProperties } from 'react'

import Link from 'next/link'
import { MarkdownContent } from '@/components/common/markdown-content'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

import { HomepageStickyNotes } from './HomepageStickyNotes'
import type { HomepageAboutProps } from './types'

export const HomepageAbout = ({ data }: HomepageAboutProps) => {
  const stickyNotes = data?.stickyNotes ?? []
  const hasStickyNotes = stickyNotes.length > 0

  if (!data?.title && !data?.description && !hasStickyNotes) {
    return null
  }

  return (
    <section data-section="homepage-about" className="bg-orange">
      <div className="sc-inner pc-t-50 pc-b-75 mb-t-75 mb-b-50">
        <div className="container">
          {hasStickyNotes && <HomepageStickyNotes notes={stickyNotes} />}
          <div className="content">
            <div className="content-header">
              {data.title && (
                <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
                  <MarkdownContent
                    as="h2"
                    className="type-d-header type-m-headliner-m weight-medium letter-spacing-002"
                  >
                    {data.title}
                  </MarkdownContent>
                </AnimateOnScroll>
              )}
            </div>
            <div className="content-body">
              {data.description && (
                <AnimateOnScroll triggerClass="fadeIn" className="sc-desc">
                  <MarkdownContent
                    as="p"
                    className="type-d-body-m type-m-body-r letter-spacing-002"
                  >
                    {data.description}
                  </MarkdownContent>
                </AnimateOnScroll>
              )}

              <AnimateOnScroll triggerClass="fadeIn" className="sc-cta">
                <Link
                  href="/about"
                  className="button-template c-beige-hover"
                  style={{ '--button-bg-color': 'var(--color-thonglor-navy)' } as CSSProperties}
                >
                  <span>
                    <span>MORE ABOUT US</span>
                  </span>
                </Link>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
