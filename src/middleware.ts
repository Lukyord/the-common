import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getComingSoonRewritePath } from '@/constants/comingSoonBranches'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const comingSoonPath = getComingSoonRewritePath(pathname)
  if (comingSoonPath) {
    const url = request.nextUrl.clone()
    url.pathname = comingSoonPath

    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    })
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
