'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type SafariContextType = {
  isSafari: boolean
}

const SafariContext = createContext<SafariContextType>({ isSafari: false })

export const useSafari = () => useContext(SafariContext)

export function SafariProvider({ children }: { children: ReactNode }) {
  const [isSafari, setIsSafari] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check for backdrop-filter support first (most reliable)
    let supportsBackdropFilter = false
    try {
      supportsBackdropFilter =
        CSS.supports('backdrop-filter', 'blur(1px)') ||
        CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
    } catch (e) {
      supportsBackdropFilter = false
    }

    // If backdrop-filter is not supported, use fallback
    if (!supportsBackdropFilter) {
      setIsSafari(true)
      const html = document.documentElement
      html.classList.add('is-safari')
      return
    }

    // Additional Safari detection (for cases where backdrop-filter exists but doesn't work well)
    const userAgent = window.navigator.userAgent.toLowerCase()
    const vendor = navigator.vendor?.toLowerCase() || ''

    // Safari detection (excluding Chrome which also has Safari in userAgent)
    const isSafariBrowser =
      (vendor.indexOf('apple') > -1 && userAgent.indexOf('chrome') === -1) ||
      (userAgent.indexOf('safari') > -1 &&
        userAgent.indexOf('chrome') === -1 &&
        userAgent.indexOf('chromium') === -1)

    setIsSafari(isSafariBrowser)

    // Add class to HTML element
    const html = document.documentElement
    if (isSafariBrowser) {
      html.classList.add('is-safari')
    } else {
      html.classList.remove('is-safari')
    }
  }, [])

  return <SafariContext.Provider value={{ isSafari }}>{children}</SafariContext.Provider>
}
