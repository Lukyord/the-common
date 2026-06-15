export type ParsedSocialLinks = {
  facebook?: string
  instagram?: string
  grab?: string
  website?: string
}

function extractUrl(value: string): string | undefined {
  const match = value.match(/https?:\/\/\S+/i)
  if (match) return match[0].replace(/[)\],.]+$/, '')

  const bare = value.match(/(?:facebook\.com|instagram\.com|grab\.com)\/\S+/i)
  if (bare) return `https://${bare[0].replace(/[)\],.]+$/, '')}`

  return undefined
}

export function parseSocialLinks(raw: string | null | undefined): ParsedSocialLinks {
  if (!raw?.trim()) return {}

  const result: ParsedSocialLinks = {}

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const [labelPart, ...rest] = trimmed.split(':')
    const label = labelPart.trim().toLowerCase()
    const value = (rest.length ? rest.join(':') : trimmed).trim()
    const url = extractUrl(value)
    if (!url) continue

    if (label.startsWith('fb') || label.includes('facebook')) {
      result.facebook = url
    } else if (label.startsWith('ig') || label.includes('instagram')) {
      result.instagram = url
    } else if (label.includes('grab')) {
      result.grab = url
    } else if (label.includes('website') || label.includes('wbsite')) {
      result.website = url
    }
  }

  return result
}
