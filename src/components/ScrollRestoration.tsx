'use client'

import { usePathname } from 'next/navigation'
import { useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { registerLenis, scrollToTop } from '@/utils/functions/scrollTo'

const REFRESH_AFTER_NAV_MS = 100

function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}

export default function ScrollRestoration(): null {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) registerLenis(lenis)
    return () => registerLenis(null)
  }, [lenis])

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    scrollToTop({ immediate: true })

    // Layout-persistent triggers (e.g. footer) keep stale start/end after route
    // changes change document height — refresh once the new page has painted.
    const frame = requestAnimationFrame(refreshScrollTriggers)
    const timeout = window.setTimeout(refreshScrollTriggers, REFRESH_AFTER_NAV_MS)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [pathname])

  return null
}
