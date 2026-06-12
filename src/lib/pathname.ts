const FOOTER_HIDDEN_SECTIONS = new Set(['whats-on', 'blogs'])

export function getSlugFromPathname(pathname: string): string {
  if (pathname === '/') return ''
  return pathname.split('/').filter(Boolean)[0] ?? ''
}

export function isBranchPathname(pathname: string, branchSlugs: ReadonlySet<string>): boolean {
  const slug = getSlugFromPathname(pathname)
  return slug !== '' && branchSlugs.has(slug)
}

export function isFooterHiddenPathname(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length < 2) return false

  const section = segments[segments.length - 2]
  const slug = segments[segments.length - 1]

  if (segments.length === 2 && segments[0] === 'blogs') {
    return true
  }

  if (segments.length === 3 && FOOTER_HIDDEN_SECTIONS.has(section)) {
    return slug !== 'archive'
  }

  return false
}
