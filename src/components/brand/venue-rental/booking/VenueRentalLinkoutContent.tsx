import Link from 'next/link'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { LexicalToHTML } from '@/components/common/lexicaltoHTML'

import type { VenueRentalBookingCta } from '../types'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'

type VenueRentalLinkoutContentProps = {
  title?: string
  bookingCta: VenueRentalBookingCta
}

export default function VenueRentalLinkoutContent({
  title,
  bookingCta,
}: VenueRentalLinkoutContentProps) {
  return (
    <div className="venue-form">
      <div className="venue-form-inner venue-booking-success">
        {title && (
          <AnimateOnScroll triggerClass="fadeIn" className="venue-booking-success__title">
            <MarkdownContent
              as="h2"
              className="type-d-body-l type-m-title weight-medium letter-spacing-002 uppercase"
            >
              {title}
            </MarkdownContent>
          </AnimateOnScroll>
        )}
        <AnimateOnScroll
          triggerClass="fadeIn"
          className="venue-booking-success__message venue-booking-success__message type-d-body-l type-m-body-m weight-medium letter-spacing-002"
        >
          {bookingCta.linkoutDescription && (
            <LexicalToHTML data={bookingCta.linkoutDescription as SerializedEditorState} />
          )}
        </AnimateOnScroll>

        {bookingCta.linkoutButtonText && (
          <AnimateOnScroll triggerClass="fadeIn">
            <Link
              href={bookingCta.linkoutButtonLink}
              className={`button-template ${bookingCta.linkoutButtonLink ? '' : 'disabled'}`}
              style={
                {
                  '--button-bg-color': bookingCta.linkoutButtonBgColor,
                } as React.CSSProperties
              }
            >
              <span>
                <span>{bookingCta.linkoutButtonText}</span>
              </span>
            </Link>
          </AnimateOnScroll>
        )}
      </div>
    </div>
  )
}
