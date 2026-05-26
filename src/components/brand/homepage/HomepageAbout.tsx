import type { CSSProperties } from 'react'

import type { Homepage } from '@/payload-types'
import Link from 'next/link'
import { MarkdownContent } from '@/components/common/markdown-content'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

type HomepageAboutProps = {
  data?: Homepage['about']
}

export const HomepageAbout = ({ data }: HomepageAboutProps) => {
  const stickyNotes = data?.stickyNotes ?? []
  const hasStickyNotes = stickyNotes.length > 0

  if (!data?.title && !data?.description && !hasStickyNotes) {
    return null
  }

  return (
    <section data-section="homepage-about" className="bg-orange">
      <div className="sc-inner pc-t-125 pc-b-75 mb-t-100 mb-b-75">
        <div className="container">
          {hasStickyNotes && (
            <div className="sticky-notes-wrapper">
              {stickyNotes.map((note, index) => (
                <AnimateOnScroll
                  triggerClass="fadeIn"
                  key={note.id ?? `sticky-note-${index}`}
                  className="sticky-note"
                  style={
                    {
                      '--background-color': note.bgColor,
                      '--text-color': note.textColor,
                    } as CSSProperties
                  }
                  data-shape={note.shape}
                >
                  <div className="sticky-note-text">
                    <MarkdownContent
                      as="p"
                      className="type-d-header weight-medium letter-spacing-002"
                    >
                      {note.text}
                    </MarkdownContent>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          )}
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
