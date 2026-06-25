import type { VenueRentalBookingCta } from '../types'
import FormFieldError from './FormFieldError'
import FormTextField from './FormTextField'
import VenueRentalAreaRadioSelect, {
  venueRentalAreaRadioOptionsFromLabels,
} from './VenueRentalAreaRadioSelect'
import VenueRentalDateField from './VenueRentalDateField'
import VenueRentalTimeSelect from './VenueRentalTimeSelect'
import type { VenueRentalBookingFormFieldKey } from './venueRentalBookingFormSchema'
import { getVenueAreaSelectStyle, venueRentalFieldErrorId } from './venueRentalFormUtils'
import { VENUE_RENTAL_BOOKING_TIME_OPTIONS } from './venueRentalTimeSlots'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

type VenueRentalBookingFieldsProps = {
  formAreaOptions: string[]
  bookingCta?: VenueRentalBookingCta | null
  errors: Partial<Record<VenueRentalBookingFormFieldKey, string>>
  bookingDurationHours: number
  startTimeOptions: string[]
  onBookingTimeChange: (value: string) => void
}

export default function VenueRentalBookingFields({
  formAreaOptions,
  bookingCta,
  errors,
  bookingDurationHours,
  startTimeOptions,
  onBookingTimeChange,
}: VenueRentalBookingFieldsProps) {
  const areaSelectStyle = getVenueAreaSelectStyle(bookingCta)
  const errorId = venueRentalFieldErrorId

  return (
    <>
      <FormTextField
        id="venue-rental-name"
        name="name"
        label="Name"
        error={errors.name}
        errorId={errorId('name')}
      />

      <FormTextField
        id="venue-rental-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        errorId={errorId('email')}
      />

      <FormTextField
        id="venue-rental-phone"
        name="phone"
        label="Phone number (Optional)"
        type="tel"
        autoComplete="tel"
        error={errors.phone}
        errorId={errorId('phone')}
      />

      {formAreaOptions.length > 0 && (
        <VenueRentalAreaRadioSelect
          legend="Desired area"
          name="desired-area"
          options={venueRentalAreaRadioOptionsFromLabels(formAreaOptions)}
          style={areaSelectStyle}
          error={errors.desiredArea}
          errorId={errorId('desiredArea')}
        />
      )}

      <VenueRentalAreaRadioSelect
        legend="Booking time"
        name="booking-time"
        options={VENUE_RENTAL_BOOKING_TIME_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        style={areaSelectStyle}
        error={errors.bookingTime}
        errorId={errorId('bookingTime')}
        onOptionChange={onBookingTimeChange}
      />

      <AnimateOnScroll triggerClass="fadeIn">
        <fieldset className="field field--reservation">
          <legend className="field-label type-d-body-s type-m-body-m letter-spacing-002 weight-medium">
            Reservation (8:00AM - Midnight)
          </legend>

          <div className="field-row">
            <VenueRentalDateField
              error={errors.reservationDate}
              errorId={errorId('reservationDate')}
            />

            <div className="field field--half">
              <VenueRentalTimeSelect
                key={bookingDurationHours}
                id="venue-rental-start-time"
                name="reservation-start-time"
                label="Starting time"
                options={startTimeOptions}
                defaultValue={startTimeOptions[0]}
              />
              <FormFieldError
                id={errorId('reservationStartTime')}
                message={errors.reservationStartTime}
              />
            </div>
          </div>
        </fieldset>
      </AnimateOnScroll>

      <FormTextField
        id="venue-rental-inquiry"
        name="inquiry"
        label="Further inquiry here (Optional)"
        error={errors.inquiry}
        errorId={errorId('inquiry')}
        multiline
      />
    </>
  )
}
