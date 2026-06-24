import Link from 'next/link'

import type { VenueRentalBookingCta } from '../types'
import { getVenueRentalSubmitButtonProps } from './venueRentalFormUtils'

type VenueRentalBookingSuccessProps = {
  bookingCta?: VenueRentalBookingCta | null
}

export default function VenueRentalBookingSuccess({ bookingCta }: VenueRentalBookingSuccessProps) {
  const buttonProps = getVenueRentalSubmitButtonProps(bookingCta)

  return (
    <div className="venue-form">
      <div className="venue-form-inner venue-booking-success">
        <p className="venue-booking-success__message type-d-body-l type-m-headliner-m weight-medium letter-spacing-002">
          Your form has been successfully submitted.
          <br />
          We appreciate you taking the time to reach out, and we&apos;ll be in touch soon.
        </p>

        <Link href="/" className={buttonProps.className} style={buttonProps.style}>
          <span>
            <span>BACK TO HOME</span>
          </span>
        </Link>
      </div>
    </div>
  )
}
