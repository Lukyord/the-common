import { NextResponse } from 'next/server'

import {
  createVenueRentalBookingFormSchema,
  fieldErrorsFromZodError,
  normalizeVenueRentalBookingFormValues,
  venueRentalBookingFormErrorToastMessage,
  type VenueRentalBookingFormValues,
} from '@/components/brand/venue-rental/booking/venueRentalBookingFormSchema'
import { sendVenueRentalBookingInquiry } from '@/lib/email/sendVenueRentalBookingInquiry'
import { getResendConfig, readWorkerEnv } from '@/lib/email/resendConfig'

export const dynamic = 'force-dynamic'

const DEFAULT_INQUIRY_TO_EMAIL = 'gatherings@thecommonsbkk.com'

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const payload = body as VenueRentalBookingFormValues & { formAreaOptions?: string[] }
  const formAreaOptions = Array.isArray(payload.formAreaOptions)
    ? payload.formAreaOptions.filter((item): item is string => typeof item === 'string')
    : []

  const parsed = createVenueRentalBookingFormSchema(formAreaOptions).safeParse(payload)

  if (!parsed.success) {
    const fieldErrors = fieldErrorsFromZodError(parsed.error)
    return NextResponse.json(
      { error: venueRentalBookingFormErrorToastMessage(fieldErrors), fieldErrors },
      { status: 400 },
    )
  }

  const to =
    (await readWorkerEnv('VENUE_RENTAL_INQUIRY_TO_EMAIL')) || DEFAULT_INQUIRY_TO_EMAIL
  const { apiKey, from } = await getResendConfig()

  if (!from) {
    return NextResponse.json({ error: 'Sender address is not configured' }, { status: 503 })
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 })
  }

  const result = await sendVenueRentalBookingInquiry({
    values: normalizeVenueRentalBookingFormValues(parsed.data),
    to,
    from,
    apiKey,
  })

  if (result.ok === false) {
    console.error('Venue rental booking inquiry email failed:', result.error)
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      {
        error: isDev ? result.error : 'Unable to send your inquiry. Please try again later.',
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
