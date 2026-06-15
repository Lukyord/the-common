export function normalizeTel(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null

  let digits = raw.replace(/\D/g, '')

  if (digits.startsWith('66')) {
    digits = digits.slice(2)
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  if (!digits) return null

  return `+66${digits}`
}

export function normalizeTelList(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return []

  const parts = raw
    .split(/[,;/]|(?:\s+or\s+)/i)
    .map((part) => normalizeTel(part))
    .filter((value): value is string => Boolean(value))

  return [...new Set(parts)]
}
