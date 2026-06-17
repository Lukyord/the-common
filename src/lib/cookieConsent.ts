import { COOKIE_CONSENT_STORAGE_KEY } from '@/constants/cookieConsent'

export type CookieConsentValue = 'accepted'

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null

  const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  return value === 'accepted' ? 'accepted' : null
}

export function setCookieConsent(): void {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted')
}

export function hasAcceptedCookies(): boolean {
  return getCookieConsent() === 'accepted'
}
