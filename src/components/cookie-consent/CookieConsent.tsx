'use client'

import { type ReactNode } from 'react'

import { CookieConsentProvider } from '@/context/CookieConsentContext'

import CookieConsentBar from './CookieConsentBar'
import GoogleAnalytics from './GoogleAnalytics'

type Props = {
  children?: ReactNode
}

export default function CookieConsent({ children }: Props) {
  return (
    <CookieConsentProvider>
      {children}
      <CookieConsentBar />
      <GoogleAnalytics />
    </CookieConsentProvider>
  )
}
