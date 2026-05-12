export function getAbsoluteUrl(url: string | null | undefined): string {
  if (!url) return ''

  // If already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Get base URL from environment variable
  // Set NEXT_PUBLIC_SITE_URL=https://pewaflora.com in your environment
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.thecommonsbkk.com/'

  // Ensure baseUrl doesn't end with / and url doesn't start with /
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return `${cleanBaseUrl}${cleanUrl}`
}
