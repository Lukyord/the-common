import { Resend } from 'resend'

import type { ContactFormValues } from '@/components/brand/contact/contactFormSchema'
import {
  buildInquiryEmailHtml,
  buildInquiryEmailText,
  type InquiryEmailField,
} from '@/lib/email/inquiryEmailTemplate'

export type SendContactInquiryParams = {
  values: ContactFormValues
  to: string
  from: string
  apiKey: string
}

export type SendContactInquiryResult =
  | { ok: true }
  | { ok: false; error: string }

function getResendClient(apiKey: string): Resend | null {
  if (!apiKey) return null
  return new Resend(apiKey)
}

function buildInquiryContent(values: ContactFormValues) {
  const fields: InquiryEmailField[] = [
    { label: 'Name', value: values.name },
    { label: 'Email', value: values.email, href: `mailto:${values.email}` },
  ]

  if (values.phone.trim()) {
    fields.push({ label: 'Phone', value: values.phone, href: `tel:${values.phone.replace(/\s/g, '')}` })
  }

  if (values.subject.trim()) {
    fields.push({ label: 'Subject', value: values.subject })
  }

  return {
    heading: 'Contact Inquiry',
    fields,
    section: { label: 'Message', value: values.message },
  }
}

export async function sendContactInquiry({
  values,
  to,
  from,
  apiKey,
}: SendContactInquiryParams): Promise<SendContactInquiryResult> {
  const resend = getResendClient(apiKey)
  if (!resend) {
    return { ok: false, error: 'Email service is not configured' }
  }

  const subjectLabel = values.subject.trim() || 'General inquiry'
  const content = buildInquiryContent(values)
  const text = buildInquiryEmailText(content)
  const html = buildInquiryEmailHtml(content)

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: values.email,
    subject: `Contact inquiry: ${subjectLabel}`,
    text,
    html,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
