'use client'

import { useEffect, useState } from 'react'

import { Modal } from '@/components/common/modal'

import type { VenueRentalBookingCta } from '../types'
import VenueRentalBookingForm from './VenueRentalBookingForm'
import VenueRentalBookingSuccess from './VenueRentalBookingSuccess'
import VenueRentalLinkoutContent from './VenueRentalLinkoutContent'

type VenueRentalBookingModalProps = {
  open: boolean
  onClose: () => void
  formTitle: string
  formAreaOptions: string[]
  bookingCta?: VenueRentalBookingCta | null
}

export default function VenueRentalBookingModal({
  open,
  onClose,
  formTitle,
  formAreaOptions,
  bookingCta,
}: VenueRentalBookingModalProps) {
  const ctaType = bookingCta?.type ?? 'form'
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (!open) setTimeout(() => setIsSubmitted(false), 300)
  }, [open])

  return (
    <Modal open={open} onClose={onClose} className="venue-rental-modal">
      <button type="button" onClick={onClose} aria-label="Close" className="modal__close">
        <i className="ic ic-close-bold"></i>
      </button>

      {ctaType === 'linkout' ? (
        <VenueRentalLinkoutContent bookingCta={bookingCta ?? { type: 'linkout' }} />
      ) : isSubmitted ? (
        <VenueRentalBookingSuccess bookingCta={bookingCta} />
      ) : (
        <VenueRentalBookingForm
          title={formTitle}
          formAreaOptions={formAreaOptions}
          bookingCta={bookingCta}
          onSubmitSuccess={() => setIsSubmitted(true)}
        />
      )}
    </Modal>
  )
}
