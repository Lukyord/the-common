import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import React, { type CSSProperties } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import BackLink from '@/components/common/BackLink'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import { isWhatsOnArchived } from '@/lib/whatsOnArchive'

import WhatsOnSingleGallery from './WhatsOnSingleGallery'
import WhatsOnSingleHeader from './WhatsOnSingleHeader'
import type { WhatsOnSingleProps } from './types'

export default function WhatsOnSingle({ event, backHref, getTagHref }: WhatsOnSingleProps) {
  const showInfo = !isWhatsOnArchived(event)

  return (
    <main id="main" className="whats-on-single-page">
      <section data-section="whats-on-single">
        <div className="content-container">
          <div className="content-text">
            <AnimateOnScroll triggerClass="fadeIn" className="back-wrapper">
              <BackLink fallbackHref={backHref} className="back">
                <i className="ic ic-arrow-left size-icon-2xs"></i>
                <p className="letter-spacing-002 weight-medium">BACK</p>
              </BackLink>
            </AnimateOnScroll>

            <div className="content-scroll" data-lenis-prevent>
              <WhatsOnSingleHeader event={event} getTagHref={getTagHref} showInfo={showInfo} />

              {event.content && (
                <AnimateOnScroll triggerClass="fadeIn" className="sc-content entry-content">
                  <LexicalToHTML data={event.content as SerializedEditorState} />
                </AnimateOnScroll>
              )}

              {event.buttonText && event.buttonLink && (
                <AnimateOnScroll triggerClass="fadeIn" className="sc-cta">
                  <Link
                    href={event.buttonLink}
                    className="button-template"
                    style={{ '--button-bg-color': event.buttonColor } as CSSProperties}
                  >
                    <span>
                      <span>{event.buttonText}</span>
                    </span>
                  </Link>
                </AnimateOnScroll>
              )}
            </div>
          </div>

          <WhatsOnSingleGallery items={event.gallery} bgColor={event.bgColor} />
        </div>
      </section>
    </main>
  )
}
