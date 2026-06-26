import { normalizeTelHref } from '@/lib/formatPhone'

import type { FooterSocial } from './footer-types'

export function mergeFooterSocials(brand: FooterSocial, branch?: FooterSocial | null): FooterSocial {
  return {
    instagram: branch?.instagram?.trim() || brand.instagram,
    facebook: branch?.facebook?.trim() || brand.facebook,
    line: branch?.line?.trim() || brand.line,
  }
}

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
