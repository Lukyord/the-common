'use client'

import { Modal } from '@/components/common/modal'

import type { VenueRentalBookingCta } from './types'
import VenueRentalLinkoutContent from './VenueRentalLinkoutContent'
import VenueRentalBookingForm from './VenueRentalBookingForm'

type VenueRentalBookingModalProps = {
  open: boolean
  onClose: () => void
  formTitle: string
  showBackMobile: boolean
  formAreaOptions: string[]
  bookingCta?: VenueRentalBookingCta | null
}

export default function VenueRentalBookingModal({
  open,
  onClose,
  formTitle,
  showBackMobile,
  formAreaOptions,
  bookingCta,
}: VenueRentalBookingModalProps) {
  const ctaType = bookingCta?.type ?? 'form'

  return (
    <Modal open={open} onClose={onClose} className="venue-rental-modal">
      <button type="button" onClick={onClose} aria-label="Close" className="modal__close">
        <i className="ic ic-close-bold"></i>
      </button>

      {ctaType === 'linkout' ? (
        <VenueRentalLinkoutContent bookingCta={bookingCta ?? { type: 'linkout' }} />
      ) : (
        <VenueRentalBookingForm
          title={formTitle}
          showBackMobile={showBackMobile}
          formAreaOptions={formAreaOptions}
          bookingCta={bookingCta}
        />
      )}
    </Modal>
  )
}
