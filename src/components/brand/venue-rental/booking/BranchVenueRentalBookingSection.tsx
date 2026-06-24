'use client'

import { useState } from 'react'

import type { VenueRentalBookingCta } from '../types'
import VenueRentalBookingForm from './VenueRentalBookingForm'
import VenueRentalBookingSuccess from './VenueRentalBookingSuccess'
import VenueRentalLinkoutContent from './VenueRentalLinkoutContent'

type BranchVenueRentalBookingSectionProps = {
  formTitle: string
  formAreaOptions: string[]
  bookingCta?: VenueRentalBookingCta | null
}

export default function BranchVenueRentalBookingSection({
  formTitle,
  formAreaOptions,
  bookingCta,
}: BranchVenueRentalBookingSectionProps) {
  const ctaType = bookingCta?.type ?? 'form'
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (ctaType === 'linkout') {
    return <VenueRentalLinkoutContent bookingCta={bookingCta ?? { type: 'linkout' }} />
  }

  if (isSubmitted) {
    return <VenueRentalBookingSuccess bookingCta={bookingCta} />
  }

  return (
    <VenueRentalBookingForm
      title={formTitle}
      formAreaOptions={formAreaOptions}
      bookingCta={bookingCta}
      onSubmitSuccess={() => setIsSubmitted(true)}
    />
  )
}
