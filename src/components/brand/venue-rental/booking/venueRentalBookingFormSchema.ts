import { z } from 'zod'

import {
  FORM_SUBMISSION_ERROR_TOAST_MESSAGE,
  FORM_VALIDATION_TOAST_MESSAGE,
} from '@/constants/formToastMessages'

import { getTodayDateString } from './venueRentalFormUtils'
import {
  buildVenueRentalStartTimes,
  VENUE_RENTAL_BOOKING_TIME_OPTIONS,
} from './venueRentalTimeSlots'

export const venueRentalBookingFormFieldKeys = [
  'name',
  'email',
  'phone',
  'desiredArea',
  'bookingTime',
  'reservationDate',
  'reservationStartTime',
  'inquiry',
] as const

export type VenueRentalBookingFormFieldKey = (typeof venueRentalBookingFormFieldKeys)[number]

export type VenueRentalBookingFormValues = {
  formTitle: string
  name: string
  email: string
  phone: string
  desiredArea: string
  bookingTime: string
  reservationDate: string
  reservationStartTime: string
  inquiry: string
}

const bookingTimeValues = VENUE_RENTAL_BOOKING_TIME_OPTIONS.map((option) => option.value)

export function createVenueRentalBookingFormSchema(formAreaOptions: string[]) {
  const desiredAreaSchema =
    formAreaOptions.length > 0
      ? z
          .string()
          .trim()
          .min(1, 'Please select a desired area')
          .refine((value) => formAreaOptions.includes(value), 'Please select a desired area')
      : z.string().optional().or(z.literal(''))

  return z
    .object({
      formTitle: z.string().trim().optional().or(z.literal('')),
      name: z.string().trim().min(1, 'Name is required'),
      email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
      phone: z.string().trim().max(30, 'Phone number is too long').optional().or(z.literal('')),
      desiredArea: desiredAreaSchema,
      bookingTime: z
        .string()
        .trim()
        .refine(
          (value) => bookingTimeValues.includes(value as '5' | '10'),
          'Please select a booking time',
        ),
      reservationDate: z
        .string()
        .trim()
        .min(1, 'Please select a date')
        .refine((value) => value >= getTodayDateString(), 'Select a date from today onwards'),
      reservationStartTime: z.string().trim().min(1, 'Please select a starting time'),
      inquiry: z.string().trim().max(2000, 'Inquiry is too long').optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
      const bookingHours = Number(data.bookingTime)
      const validStartTimes = buildVenueRentalStartTimes(bookingHours)

      if (!validStartTimes.includes(data.reservationStartTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select a valid starting time',
          path: ['reservationStartTime'],
        })
      }
    })
}

export function venueRentalBookingFormValuesFromFormData(
  formData: FormData,
  formTitle: string,
): Omit<VenueRentalBookingFormValues, 'formTitle'> & { formTitle?: string } {
  return {
    formTitle,
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    desiredArea: String(formData.get('desired-area') ?? ''),
    bookingTime: String(formData.get('booking-time') ?? ''),
    reservationDate: String(formData.get('reservation-date') ?? ''),
    reservationStartTime: String(formData.get('reservation-start-time') ?? ''),
    inquiry: String(formData.get('inquiry') ?? ''),
  }
}

export function normalizeVenueRentalBookingFormValues(
  values: z.infer<ReturnType<typeof createVenueRentalBookingFormSchema>>,
): VenueRentalBookingFormValues {
  return {
    formTitle: values.formTitle ?? '',
    name: values.name,
    email: values.email,
    phone: values.phone ?? '',
    desiredArea: values.desiredArea ?? '',
    bookingTime: values.bookingTime,
    reservationDate: values.reservationDate,
    reservationStartTime: values.reservationStartTime,
    inquiry: values.inquiry ?? '',
  }
}

export function fieldErrorsFromZodError(
  error: z.ZodError,
): Partial<Record<VenueRentalBookingFormFieldKey, string>> {
  const errors: Partial<Record<VenueRentalBookingFormFieldKey, string>> = {}

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (
      typeof key === 'string' &&
      venueRentalBookingFormFieldKeys.includes(key as VenueRentalBookingFormFieldKey) &&
      !errors[key as VenueRentalBookingFormFieldKey]
    ) {
      errors[key as VenueRentalBookingFormFieldKey] = issue.message
    }
  }

  return errors
}

export function venueRentalBookingFormErrorToastMessage(
  fieldErrors: Partial<Record<VenueRentalBookingFormFieldKey, string>>,
  fallback = FORM_SUBMISSION_ERROR_TOAST_MESSAGE,
): string {
  const hasFieldErrors = venueRentalBookingFormFieldKeys.some((key) => fieldErrors[key])

  return hasFieldErrors ? FORM_VALIDATION_TOAST_MESSAGE : fallback
}

export function getBookingTimeLabel(bookingTime: string): string {
  return (
    VENUE_RENTAL_BOOKING_TIME_OPTIONS.find((option) => option.value === bookingTime)?.label ??
    bookingTime
  )
}
