import type { VenueRentalBookingCta } from '../types'
import { getVenueRentalSubmitButtonProps } from './venueRentalFormUtils'

type VenueRentalSubmitButtonProps = {
  bookingCta?: VenueRentalBookingCta | null
  isSubmitting?: boolean
}

export default function VenueRentalSubmitButton({
  bookingCta,
  isSubmitting = false,
}: VenueRentalSubmitButtonProps) {
  const buttonProps = getVenueRentalSubmitButtonProps(bookingCta)

  return (
    <div className="form-submit">
      <button type="submit" className={buttonProps.className} disabled={isSubmitting} style={buttonProps.style}>
        <span>
          <span>{isSubmitting ? 'SENDING…' : 'SUBMIT'}</span>
        </span>
      </button>
    </div>
  )
}
