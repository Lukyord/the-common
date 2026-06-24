import Link from 'next/link'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { LexicalToHTML } from '@/components/common/lexicaltoHTML'

import type { VenueRentalBookingCta } from '../types'

type VenueRentalLinkoutContentProps = {
  bookingCta: VenueRentalBookingCta
}

export default function VenueRentalLinkoutContent({ bookingCta }: VenueRentalLinkoutContentProps) {
  return (
    <div>
      {bookingCta.linkoutDescription && (
        <LexicalToHTML data={bookingCta.linkoutDescription as SerializedEditorState} />
      )}

      {bookingCta.linkoutButtonText && bookingCta.linkoutButtonLink && (
        <Link href={bookingCta.linkoutButtonLink}>{bookingCta.linkoutButtonText}</Link>
      )}
    </div>
  )
}
