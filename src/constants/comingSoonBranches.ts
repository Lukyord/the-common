export const COMING_SOON_BRANCH_SLUGS = [] as const

export type ComingSoonBranchSlug = (typeof COMING_SOON_BRANCH_SLUGS)[number]

export const COMING_SOON_PREVIEW_QUERY_PARAM = 'preview'
export const COMING_SOON_PREVIEW_COOKIE = 'tc_cs_preview'
export const COMING_SOON_PREVIEW_SECRET = 'tc-cloud11-live'

// Example Path: /cloud-11?preview=tc-cloud11-live
// Example Cookie: tc_cs_preview=tc-cloud11-live

export function isComingSoonBranchPath(pathname: string): boolean {
  return COMING_SOON_BRANCH_SLUGS.some(
    (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`),
  )
}

export function isComingSoonPreviewActive(request: {
  cookies: { get: (name: string) => { value: string } | undefined }
  nextUrl: { searchParams: URLSearchParams }
}): boolean {
  const previewParam = request.nextUrl.searchParams.get(COMING_SOON_PREVIEW_QUERY_PARAM)

  if (previewParam === COMING_SOON_PREVIEW_SECRET) {
    return true
  }

  return request.cookies.get(COMING_SOON_PREVIEW_COOKIE)?.value === COMING_SOON_PREVIEW_SECRET
}

export function getComingSoonRewritePath(pathname: string): string | null {
  for (const slug of COMING_SOON_BRANCH_SLUGS) {
    if (pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)) {
      return `/coming-soon/${slug}`
    }
  }

  return null
}
