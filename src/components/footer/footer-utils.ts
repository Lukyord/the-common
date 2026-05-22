export function toTelHref(value?: string | null) {
  return value ? `tel:${value.replace(/\s/g, '')}` : undefined
}

export function toExternalHref(value?: string | null) {
  return value?.startsWith('http') ? value : undefined
}

export function toEmailHref(email?: string | null) {
  return email ? `mailto:${email}` : undefined
}
