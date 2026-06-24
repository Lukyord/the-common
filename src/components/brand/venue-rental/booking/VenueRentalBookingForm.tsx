'use client'

import { MarkdownContent } from '@/components/common/markdown-content'

import type { VenueRentalBookingCta } from '../types'
import VenueRentalBookingFields from './VenueRentalBookingFields'
import VenueRentalSubmitButton from './VenueRentalSubmitButton'
import { useVenueRentalBookingForm } from './useVenueRentalBookingForm'

type VenueRentalBookingFormProps = {
  title?: string
  formAreaOptions?: string[]
  bookingCta?: VenueRentalBookingCta | null
  onSubmitSuccess?: () => void
}

export default function VenueRentalBookingForm({
  title,
  formAreaOptions = [],
  bookingCta,
  onSubmitSuccess,
}: VenueRentalBookingFormProps) {
  const {
    formRef,
    errors,
    isSubmitting,
    bookingDurationHours,
    startTimeOptions,
    handleBookingTimeChange,
    handleSubmit,
  } = useVenueRentalBookingForm({
    title,
    formAreaOptions,
    onSubmitSuccess,
  })

  return (
    <div className="venue-form">
      <div className="venue-form-inner">
        {title && (
          <MarkdownContent
            as="h2"
            className="form-ttl type-d-body-l type-m-title weight-medium letter-spacing-002 uppercase"
          >
            {title}
          </MarkdownContent>
        )}

        <form ref={formRef} action="" onSubmit={handleSubmit} noValidate>
          <div className="fields">
            <VenueRentalBookingFields
              formAreaOptions={formAreaOptions}
              bookingCta={bookingCta}
              errors={errors}
              bookingDurationHours={bookingDurationHours}
              startTimeOptions={startTimeOptions}
              onBookingTimeChange={handleBookingTimeChange}
            />

            <VenueRentalSubmitButton bookingCta={bookingCta} isSubmitting={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  )
}
