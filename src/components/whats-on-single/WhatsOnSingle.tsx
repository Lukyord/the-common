import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import { type CSSProperties } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { ContentSingleLayout } from '@/components/common/content-single'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import { isWhatsOnArchived } from '@/lib/whatsOnArchive'

import WhatsOnSingleHeader from './WhatsOnSingleHeader'
import type { WhatsOnSingleProps } from './types'

export default function WhatsOnSingle({
  event,
  backHref,
  getTagHref,
  branchFooterBgColor,
}: WhatsOnSingleProps) {
  const showInfo = !isWhatsOnArchived(event)

  return (
    <ContentSingleLayout
      section="whats-on-single"
      backHref={backHref}
      gallery={{ items: event.gallery, bgColor: event.bgColor }}
    >
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
            style={{ '--button-bg-color': branchFooterBgColor } as CSSProperties}
          >
            <span>
              <span>{event.buttonText}</span>
            </span>
          </Link>
        </AnimateOnScroll>
      )}
    </ContentSingleLayout>
  )
}
