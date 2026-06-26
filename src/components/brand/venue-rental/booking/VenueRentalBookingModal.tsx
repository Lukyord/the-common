'use client'

import { useEffect, useState } from 'react'

import { Modal } from '@/components/common/modal'

import type { VenueRentalBookingCta } from '../types'
import VenueRentalBookingForm from './VenueRentalBookingForm'
import VenueRentalBookingSuccess from './VenueRentalBookingSuccess'

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
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (!open) setTimeout(() => setIsSubmitted(false), 300)
  }, [open])

  return (
    <Modal open={open} onClose={onClose} className="venue-rental-modal">
      <button type="button" onClick={onClose} aria-label="Close" className="modal__close">
        <i className="ic ic-close-bold show-md"></i>
        <i className="ic ic-arrow-left hidden-device-md"></i>
        <span className="hidden-device-md weight-medium">BACK</span>
      </button>

      {isSubmitted ? (
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
