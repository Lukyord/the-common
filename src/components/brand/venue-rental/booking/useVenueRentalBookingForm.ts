'use client'

import { bindFormControls, syncFormControlsFilled } from '@/hooks/useFormInit'
import { useLayoutEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'

import {
  createVenueRentalBookingFormSchema,
  fieldErrorsFromZodError,
  normalizeVenueRentalBookingFormValues,
  venueRentalBookingFormErrorToastMessage,
  venueRentalBookingFormValuesFromFormData,
  type VenueRentalBookingFormFieldKey,
} from './venueRentalBookingFormSchema'
import { FORM_SUBMISSION_ERROR_TOAST_MESSAGE } from '@/constants/formToastMessages'
import {
  buildVenueRentalStartTimes,
  VENUE_RENTAL_BOOKING_TIME_OPTIONS,
} from './venueRentalTimeSlots'

type UseVenueRentalBookingFormOptions = {
  title?: string
  formAreaOptions?: string[]
  onSubmitSuccess?: () => void
}

export function useVenueRentalBookingForm({
  title,
  formAreaOptions = [],
  onSubmitSuccess,
}: UseVenueRentalBookingFormOptions) {
  const formRef = useRef<HTMLFormElement>(null)
  const [bookingDurationHours, setBookingDurationHours] = useState<number>(
    VENUE_RENTAL_BOOKING_TIME_OPTIONS[0].hours,
  )
  const [errors, setErrors] = useState<Partial<Record<VenueRentalBookingFormFieldKey, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const startTimeOptions = useMemo(
    () => buildVenueRentalStartTimes(bookingDurationHours),
    [bookingDurationHours],
  )

  useLayoutEffect(() => {
    if (!formRef.current) return
    return bindFormControls(formRef.current)
  }, [])

  useLayoutEffect(() => {
    if (formRef.current) syncFormControlsFilled(formRef.current)
  }, [errors])

  const handleBookingTimeChange = (value: string) => {
    const option = VENUE_RENTAL_BOOKING_TIME_OPTIONS.find((item) => item.value === value)
    if (option) setBookingDurationHours(option.hours)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const values = venueRentalBookingFormValuesFromFormData(new FormData(form), title ?? '')
    const result = createVenueRentalBookingFormSchema(formAreaOptions).safeParse(values)

    if (!result.success) {
      const fieldErrors = fieldErrorsFromZodError(result.error)
      setErrors(fieldErrors)
      toast.error(venueRentalBookingFormErrorToastMessage(fieldErrors))
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/venue-rental-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...normalizeVenueRentalBookingFormValues(result.data),
          formAreaOptions,
        }),
      })

      const payload = (await response.json().catch((): null => null)) as {
        error?: string
        fieldErrors?: Partial<Record<VenueRentalBookingFormFieldKey, string>>
      } | null

      if (!response.ok) {
        const fieldErrors = payload?.fieldErrors
        if (fieldErrors) {
          setErrors(fieldErrors)
        }

        toast.error(
          fieldErrors
            ? venueRentalBookingFormErrorToastMessage(fieldErrors)
            : FORM_SUBMISSION_ERROR_TOAST_MESSAGE,
        )
        return
      }

      form.reset()
      setBookingDurationHours(VENUE_RENTAL_BOOKING_TIME_OPTIONS[0].hours)
      syncFormControlsFilled(form)
      onSubmitSuccess?.()
    } catch {
      toast.error(FORM_SUBMISSION_ERROR_TOAST_MESSAGE)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formRef,
    errors,
    isSubmitting,
    bookingDurationHours,
    startTimeOptions,
    handleBookingTimeChange,
    handleSubmit,
  }
}
