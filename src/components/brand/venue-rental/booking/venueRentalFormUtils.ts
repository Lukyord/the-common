import type { CSSProperties } from 'react'

import type { VenueRentalBookingCta } from '../types'
import type { VenueRentalBookingFormFieldKey } from './venueRentalBookingFormSchema'

export function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function venueRentalFieldErrorId(field: VenueRentalBookingFormFieldKey) {
  return `venue-rental-${field}-error`
}

export function getVenueAreaSelectStyle(bookingCta?: VenueRentalBookingCta | null): CSSProperties {
  return {
    '--venue-area-selected-bg': bookingCta?.formSelectedButtonBgColor ?? undefined,
    '--venue-area-selected-text': bookingCta?.formSelectedButtonTextColor ?? undefined,
  } as CSSProperties
}

export function getVenueRentalSubmitButtonProps(bookingCta?: VenueRentalBookingCta | null) {
  return {
    className: [
      'button-template',
      bookingCta?.formSubmitWhiteTextOnHover && 'c-white-hover',
      bookingCta?.formSubmitDarkBrownTextOnHover && 'c-dark-brown-hover',
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      '--button-bg-color': bookingCta?.formSubmitButtonBgColor,
    } as CSSProperties,
  }
}
