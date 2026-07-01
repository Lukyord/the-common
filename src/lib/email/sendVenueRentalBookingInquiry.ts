import { Resend } from 'resend'

import {
  getBookingTimeLabel,
  type VenueRentalBookingFormValues,
} from '@/components/brand/venue-rental/booking/venueRentalBookingFormSchema'
import {
  buildInquiryEmailHtml,
  buildInquiryEmailText,
  type InquiryEmailField,
} from '@/lib/email/inquiryEmailTemplate'

export type SendVenueRentalBookingInquiryParams = {
  values: VenueRentalBookingFormValues
  to: string
  from: string
  apiKey: string
}

export type SendVenueRentalBookingInquiryResult = { ok: true } | { ok: false; error: string }

function getResendClient(apiKey: string): Resend | null {
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getReservationEndTime(startTime: string, bookingTime: string): string {
  const [hours] = startTime.split(':')
  const startHour = Number(hours)
  const durationHours = Number(bookingTime)

  if (!Number.isFinite(startHour) || !Number.isFinite(durationHours)) {
    return ''
  }

  return `${String(startHour + durationHours).padStart(2, '0')}:00`
}

function buildInquiryContent(values: VenueRentalBookingFormValues) {
  const venueLabel = values.formTitle.trim() || 'Venue rental'
  const endTime = getReservationEndTime(values.reservationStartTime, values.bookingTime)
  const startTimeLabel = `${values.reservationStartTime}${endTime ? ` - ${endTime}` : ''}`

  const fields: InquiryEmailField[] = [
    { label: 'Venue', value: venueLabel },
    { label: 'Name', value: values.name },
    { label: 'Email', value: values.email, href: `mailto:${values.email}` },
  ]

  if (values.phone.trim()) {
    fields.push({ label: 'Phone', value: values.phone, href: `tel:${values.phone.replace(/\s/g, '')}` })
  }

  if (values.desiredArea.trim()) {
    fields.push({ label: 'Desired area', value: values.desiredArea })
  }

  fields.push(
    { label: 'Booking time', value: getBookingTimeLabel(values.bookingTime) },
    { label: 'Reservation date', value: values.reservationDate },
    { label: 'Starting time', value: startTimeLabel },
  )

  return {
    heading: 'Venue Rental Inquiry',
    fields,
    section: values.inquiry.trim()
      ? { label: 'Further inquiry', value: values.inquiry }
      : undefined,
  }
}

export async function sendVenueRentalBookingInquiry({
  values,
  to,
  from,
  apiKey,
}: SendVenueRentalBookingInquiryParams): Promise<SendVenueRentalBookingInquiryResult> {
  const resend = getResendClient(apiKey)
  if (!resend) {
    return { ok: false, error: 'Email service is not configured' }
  }

  const venueLabel = values.formTitle.trim() || 'Venue rental'
  const content = buildInquiryContent(values)
  const text = buildInquiryEmailText(content)
  const html = buildInquiryEmailHtml(content)

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: values.email,
    subject: `Venue Rental Inquiry: ${venueLabel}`,
    text,
    html,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
