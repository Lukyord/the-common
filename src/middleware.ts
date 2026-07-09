import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import {
  COMING_SOON_PREVIEW_COOKIE,
  COMING_SOON_PREVIEW_QUERY_PARAM,
  COMING_SOON_PREVIEW_SECRET,
  getComingSoonRewritePath,
  isComingSoonPreviewActive,
} from '@/constants/comingSoonBranches'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const comingSoonPath = getComingSoonRewritePath(pathname)
  const isPreview = isComingSoonPreviewActive(request)

  if (comingSoonPath && !isPreview) {
    const url = request.nextUrl.clone()
    url.pathname = comingSoonPath

    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    })
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  if (
    comingSoonPath &&
    request.nextUrl.searchParams.get(COMING_SOON_PREVIEW_QUERY_PARAM) ===
      COMING_SOON_PREVIEW_SECRET
  ) {
    response.cookies.set(COMING_SOON_PREVIEW_COOKIE, COMING_SOON_PREVIEW_SECRET, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
