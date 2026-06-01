import { Resend } from 'resend'

import type { ContactFormValues } from '@/components/brand/contact/contactFormSchema'
import { escapeHtml } from '@/lib/email/escapeHtml'

export type SendContactInquiryParams = {
  values: ContactFormValues
  to: string
  from: string
}

export type SendContactInquiryResult =
  | { ok: true }
  | { ok: false; error: string }

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function buildInquiryLines(values: ContactFormValues): string[] {
  const lines = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
  ]

  if (values.phone.trim()) {
    lines.push(`Phone: ${values.phone}`)
  }

  if (values.subject.trim()) {
    lines.push(`Subject: ${values.subject}`)
  }

  lines.push('', 'Message:', values.message)

  return lines
}

export async function sendContactInquiry({
  values,
  to,
  from,
}: SendContactInquiryParams): Promise<SendContactInquiryResult> {
  const resend = getResendClient()
  if (!resend) {
    return { ok: false, error: 'Email service is not configured' }
  }

  const subjectLabel = values.subject.trim() || 'General inquiry'
  const text = buildInquiryLines(values).join('\n')
  const html = buildInquiryLines(values)
    .map((line) => (line === '' ? '<br />' : `<p>${escapeHtml(line)}</p>`))
    .join('')

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
