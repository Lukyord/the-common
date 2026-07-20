import { NextResponse } from 'next/server'

import {
  contactFormErrorToastMessage,
  createContactFormSchema,
  fieldErrorsFromZodError,
  normalizeContactFormValues,
  type ContactFormValues,
} from '@/components/brand/contact/contactFormSchema'
import {
  isBecomeOurTenantContactSubject,
  isVenueRentalContactSubject,
  mergeContactSubjects,
} from '@/components/brand/contact/contactFormSubjects'
import { FORM_SUBMISSION_ERROR_TOAST_MESSAGE } from '@/constants/formToastMessages'
import { sendContactInquiry } from '@/lib/email/sendContactInquiry'
import { getResendConfig, readWorkerEnv } from '@/lib/email/resendConfig'
import { getBranchContactPages } from '@/payload/queries/branch'
import { getContactPayloadData } from '@/payload/queries/contact'

export const dynamic = 'force-dynamic'

const DEFAULT_VENUE_RENTAL_INQUIRY_TO_EMAIL = 'gatherings@thecommonsbkk.com'
const DEFAULT_BECOME_OUR_TENANT_INQUIRY_TO_EMAIL = 'curation@thecommonsbkk.com'

function nonEmptySubjects(subjects?: string[] | null): string[] {
  return subjects?.filter((item) => item.trim().length > 0) ?? []
}

function allowedContactSubjects(
  contact: Awaited<ReturnType<typeof getContactPayloadData>>['contact'],
  branchContactPages: Awaited<ReturnType<typeof getBranchContactPages>>,
) {
  const sources = [
    nonEmptySubjects(contact?.contactSubject),
    ...branchContactPages.map((page) => nonEmptySubjects(page.contactSubject)),
  ]

  return mergeContactSubjects(sources)
}

function inquiryRecipient(
  contact: Awaited<ReturnType<typeof getContactPayloadData>>['contact'],
  fallbackTo: string,
) {
  return contact?.email?.trim() || fallbackTo
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const [{ contact }, branchContactPages] = await Promise.all([
    getContactPayloadData(),
    getBranchContactPages(),
  ])
  const subjects = allowedContactSubjects(contact, branchContactPages)
  const parsed = createContactFormSchema(subjects).safeParse(body as ContactFormValues)

  if (!parsed.success) {
    const fieldErrors = fieldErrorsFromZodError(parsed.error)
    return NextResponse.json(
      { error: contactFormErrorToastMessage(fieldErrors), fieldErrors },
      { status: 400 },
    )
  }

  const values = normalizeContactFormValues(parsed.data)
  const [contactInquiryTo, venueRentalInquiryTo, becomeOurTenantInquiryTo] = await Promise.all([
    readWorkerEnv('CONTACT_INQUIRY_TO_EMAIL'),
    readWorkerEnv('VENUE_RENTAL_INQUIRY_TO_EMAIL'),
    readWorkerEnv('BECOME_OUR_TENANT_INQUIRY_TO_EMAIL'),
  ])

  const to = isVenueRentalContactSubject(values.subject)
    ? venueRentalInquiryTo || DEFAULT_VENUE_RENTAL_INQUIRY_TO_EMAIL
    : isBecomeOurTenantContactSubject(values.subject)
      ? becomeOurTenantInquiryTo || DEFAULT_BECOME_OUR_TENANT_INQUIRY_TO_EMAIL
      : inquiryRecipient(contact, contactInquiryTo)
  const { apiKey, from } = await getResendConfig()

  if (!to) {
    return NextResponse.json({ error: 'Contact recipient is not configured' }, { status: 503 })
  }

  if (!from) {
    return NextResponse.json({ error: 'Sender address is not configured' }, { status: 503 })
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 })
  }

  const result = await sendContactInquiry({
    values,
    to,
    from,
    apiKey,
  })

  if (result.ok === false) {
    console.error('Contact inquiry email failed:', result.error)
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      {
        error: isDev ? result.error : FORM_SUBMISSION_ERROR_TOAST_MESSAGE,
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
