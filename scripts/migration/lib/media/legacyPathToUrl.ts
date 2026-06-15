export function normalizeLegacyImageRef(path: string): string {
  return path.trim()
}

export function legacyPathToUrl(path: string, baseUrl: string): string {
  const normalized = normalizeLegacyImageRef(path)
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized
  }

  return `${baseUrl}/${normalized.replace(/^\//, '')}`
}
