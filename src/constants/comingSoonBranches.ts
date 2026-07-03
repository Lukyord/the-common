export const COMING_SOON_BRANCH_SLUGS = ['cloud-11'] as const

export type ComingSoonBranchSlug = (typeof COMING_SOON_BRANCH_SLUGS)[number]

export function isComingSoonBranchPath(pathname: string): boolean {
  return COMING_SOON_BRANCH_SLUGS.some(
    (slug) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`),
  )
}

export function getComingSoonRewritePath(pathname: string): string | null {
  for (const slug of COMING_SOON_BRANCH_SLUGS) {
    if (pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)) {
      return `/coming-soon/${slug}`
    }
  }

  return null
}
