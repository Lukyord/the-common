'use client'

import { useState } from 'react'

import type { VenueRentalBookingCta } from '@/components/brand/venue-rental/types'
import VenueRentalBookingForm from '@/components/brand/venue-rental/booking/VenueRentalBookingForm'
import VenueRentalBookingSuccess from '@/components/brand/venue-rental/booking/VenueRentalBookingSuccess'
import VenueRentalLinkoutContent from '@/components/brand/venue-rental/booking/VenueRentalLinkoutContent'

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
