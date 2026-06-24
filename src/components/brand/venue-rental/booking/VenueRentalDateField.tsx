'use client'

import { useRef } from 'react'

import FormFieldError from './FormFieldError'
import { getTodayDateString } from './venueRentalFormUtils'

type VenueRentalDateFieldProps = {
  error?: string
  errorId: string
}

export default function VenueRentalDateField({ error, errorId }: VenueRentalDateFieldProps) {
  const dateInputRef = useRef<HTMLInputElement>(null)

  const openDatePicker = () => {
    const input = dateInputRef.current
    if (!input) return

    input.focus()

    try {
      input.showPicker()
    } catch {
      // showPicker can throw if not triggered by a user gesture in some browsers
    }
  }

  return (
    <div className="field field--half">
      <div
        className="input input--date"
        data-has-error={error ? '' : undefined}
        onClick={openDatePicker}
      >
        <label htmlFor="venue-rental-date" className="label anim fixed">
          <span>Select Date</span>
        </label>
        <input
          ref={dateInputRef}
          id="venue-rental-date"
          name="reservation-date"
          type="date"
          min={getTodayDateString()}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <i className="ic ic-calendar" aria-hidden />
      </div>
      <FormFieldError id={errorId} message={error} />
    </div>
  )
}
