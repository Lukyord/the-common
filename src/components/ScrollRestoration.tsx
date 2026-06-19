'use client'

import { usePathname } from 'next/navigation'
import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

import { registerLenis, scrollToTop } from '@/utils/functions/scrollTo'

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
  }, [pathname])

  return null
}
