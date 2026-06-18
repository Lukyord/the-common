export function normalizeLegacyHref(href: string): string | null {
  const trimmed = href.trim()
  if (!trimmed) return null

  if (/^tel:/i.test(trimmed)) {
    const phone = trimmed.replace(/^tel:/i, '').replace(/\s+/g, '')
    return phone ? `tel:${phone}` : null
  }

  if (/^mailto:/i.test(trimmed)) {
    let email = trimmed.replace(/^mailto:/i, '')
    try {
      email = decodeURIComponent(email)
    } catch {
      // keep raw email
    }
    email = email.replace(/[\s\u00a0\u202f\u2007]/g, '').trim()
    return email ? `mailto:${email}` : null
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).toString()
    } catch {
      return null
    }
  }

  if (trimmed.startsWith('//')) {
    try {
      return new URL(`https:${trimmed}`).toString()
    } catch {
      return null
    }
  }

  try {
    return new URL(`https://${trimmed.replace(/^\/+/, '')}`).toString()
  } catch {
    return null
  }
}
