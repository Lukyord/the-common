import Link from 'next/link'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { LexicalToHTML } from '@/components/common/lexicaltoHTML'

import type { VenueRentalBookingCta } from '../types'

type VenueRentalLinkoutContentProps = {
  bookingCta: VenueRentalBookingCta
}

export default function VenueRentalLinkoutContent({ bookingCta }: VenueRentalLinkoutContentProps) {
  return (
    <div className="venue-form">
      <div className="venue-form-inner venue-booking-success">
        <div className="venue-booking-success__message venue-booking-success__message type-d-body-l type-m-headliner-m weight-medium letter-spacing-002">
          {bookingCta.linkoutDescription && (
            <LexicalToHTML data={bookingCta.linkoutDescription as SerializedEditorState} />
          )}
        </div>

        {bookingCta.linkoutButtonText && bookingCta.linkoutButtonLink && (
          <Link
            href={bookingCta.linkoutButtonLink}
            className="button-template"
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
        )}
      </div>
    </div>
  )
}
