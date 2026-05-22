export function getSlugFromPathname(pathname: string): string {
  if (pathname === '/') return ''
  return pathname.split('/').filter(Boolean)[0] ?? ''
}

export function isBranchPathname(pathname: string, branchSlugs: ReadonlySet<string>): boolean {
  const slug = getSlugFromPathname(pathname)
  return slug !== '' && branchSlugs.has(slug)
}
