function extractDigits(phone: string) {
  return phone.replace(/\D/g, '')
}

function toThaiLocalDigits(digits: string) {
  if (digits.startsWith('66')) {
    const national = digits.slice(2)

    if (national.startsWith('0')) {
      return national
    }

    if (national.length === 10) {
      return national
    }

    if (national.length === 8 || national.length === 9) {
      return `0${national}`
    }
  }

  if (digits.startsWith('0')) {
    return digits
  }

  if (digits.length === 9) {
    return `0${digits}`
  }

  return digits
}

function isThaiNumber(digits: string) {
  const local = toThaiLocalDigits(digits)

  if (local.length === 10 && local.startsWith('0')) return true
  if (local.length === 9 && local.startsWith('0')) return true

  return digits.startsWith('66') && digits.length >= 10
}

function formatThaiLocalDisplay(local: string) {
  if (local.length === 10) {
    return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
  }

  if (local.length === 9 && local.startsWith('02')) {
    return `${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`
  }

  if (local.length === 9) {
    return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
  }

  return local.replace(/(\d{3})(?=\d)/g, '$1 ').trim()
}

function formatGenericInternational(digits: string) {
  if (digits.length <= 10) {
    return formatThaiLocalDisplay(digits)
  }

  const ccLen = digits.length - 10

  if (ccLen > 0 && ccLen <= 3) {
    return `+${digits.slice(0, ccLen)} ${formatThaiLocalDisplay(digits.slice(ccLen))}`
  }

  return `+${digits}`
}

export function formatPhoneDisplay(phone: string) {
  const trimmed = phone.trim()
  if (!trimmed) return ''

  const digits = extractDigits(trimmed)
  if (!digits) return trimmed

  if (isThaiNumber(digits)) {
    return formatThaiLocalDisplay(toThaiLocalDigits(digits))
  }

  if (trimmed.startsWith('+') || digits.length > 10) {
    return formatGenericInternational(digits)
  }

  return formatThaiLocalDisplay(digits)
}

export function normalizeTelHref(phone: string) {
  const digits = extractDigits(phone)
  if (!digits) return ''

  if (digits.startsWith('66')) {
    return `+${digits}`
  }

  if (digits.startsWith('0')) {
    return `+66${digits.slice(1)}`
  }

  if (digits.length === 9 && isThaiNumber(`66${digits}`)) {
    return `+66${digits}`
  }

  if (phone.trim().startsWith('+')) {
    return `+${digits}`
  }

  return digits
}
