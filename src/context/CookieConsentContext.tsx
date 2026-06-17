'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getCookieConsent, setCookieConsent } from '@/lib/cookieConsent'

type CookieConsentContextValue = {
  hasConsented: boolean
  isReady: boolean
  acceptCookies: () => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsented] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setHasConsented(getCookieConsent() === 'accepted')
    setIsReady(true)
  }, [])

  const acceptCookies = useCallback(() => {
    setCookieConsent()
    setHasConsented(true)
  }, [])

  const value = useMemo(
    () => ({
      hasConsented,
      isReady,
      acceptCookies,
    }),
    [acceptCookies, hasConsented, isReady],
  )

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext)

  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }

  return context
}
