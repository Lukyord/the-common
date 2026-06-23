import React from 'react'
import { VenueRentalBookingCta } from './types'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import Link from 'next/link'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export default function VenueRentalLinkoutContent({
  bookingCta,
}: {
  bookingCta: VenueRentalBookingCta
}) {
  return (
    <div>
      {bookingCta.linkoutDescription ? (
        <LexicalToHTML data={bookingCta.linkoutDescription as SerializedEditorState} />
      ) : null}

      {bookingCta.linkoutButtonText && bookingCta.linkoutButtonLink ? (
        <Link href={bookingCta.linkoutButtonLink}>{bookingCta.linkoutButtonText}</Link>
      ) : null}
    </div>
  )
}
