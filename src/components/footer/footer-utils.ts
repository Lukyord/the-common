import { normalizeTelHref } from '@/lib/formatPhone'

export function toTelHref(value?: string | null) {
  const href = value ? normalizeTelHref(value) : ''
  return href ? `tel:${href}` : undefined
}

export function toExternalHref(value?: string | null) {
  return value?.startsWith('http') ? value : undefined
}

export function toEmailHref(email?: string | null) {
  return email ? `mailto:${email}` : undefined
}
