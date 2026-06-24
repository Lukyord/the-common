import { escapeHtml } from '@/lib/email/escapeHtml'

export type InquiryEmailField = {
  label: string
  value: string
  href?: string
}

export type InquiryEmailSection = {
  label: string
  value: string
}

export type InquiryEmailTemplateOptions = {
  heading: string
  fields: InquiryEmailField[]
  section?: InquiryEmailSection
}

const COLORS = {
  darkBrown: '#200000',
  beige: '#e8e4db',
  white: '#ffffff',
  label: '#6b6560',
  muted: '#888888',
  surface: '#f8f7f4',
} as const

function buildFieldRow(field: InquiryEmailField): string {
  const valueHtml = field.href
    ? `<a href="${escapeHtml(field.href)}" style="color:${COLORS.darkBrown};text-decoration:underline;">${escapeHtml(field.value)}</a>`
    : escapeHtml(field.value)

  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${COLORS.beige};">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="width:140px;vertical-align:top;padding-right:16px;">
              <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${COLORS.label};">${escapeHtml(field.label)}</span>
            </td>
            <td style="vertical-align:top;">
              <span style="font-size:15px;line-height:1.5;color:${COLORS.darkBrown};">${valueHtml}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

export function buildInquiryEmailText({
  heading,
  fields,
  section,
}: InquiryEmailTemplateOptions): string {
  const lines = [heading, '─'.repeat(Math.min(heading.length, 40)), '']

  for (const field of fields) {
    lines.push(`${field.label}: ${field.value}`)
  }

  if (section?.value.trim()) {
    lines.push('', section.label, section.value)
  }

  return lines.join('\n')
}

export function buildInquiryEmailHtml({
  heading,
  fields,
  section,
}: InquiryEmailTemplateOptions): string {
  const fieldRows = fields.map(buildFieldRow).join('')
  const sectionHtml = section?.value.trim()
    ? `
          <tr>
            <td style="padding:8px 32px 24px;">
              <div style="background-color:${COLORS.surface};border-left:3px solid ${COLORS.darkBrown};padding:16px 20px;border-radius:0 4px 4px 0;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${COLORS.label};">${escapeHtml(section.label)}</p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:${COLORS.darkBrown};white-space:pre-wrap;">${escapeHtml(section.value)}</p>
              </div>
            </td>
          </tr>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.beige};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${COLORS.beige};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:${COLORS.white};border-radius:4px;overflow:hidden;">
          <tr>
            <td style="background-color:${COLORS.darkBrown};padding:24px 32px;">
              <h1 style="margin:0;font-size:18px;font-weight:600;color:${COLORS.beige};letter-spacing:0.02em;">${escapeHtml(heading)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 16px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${fieldRows}
              </table>
            </td>
          </tr>
          ${sectionHtml}
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid ${COLORS.beige};">
              <p style="margin:0;font-size:12px;color:${COLORS.muted};text-align:center;">Reply directly to this email to respond to the sender.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
