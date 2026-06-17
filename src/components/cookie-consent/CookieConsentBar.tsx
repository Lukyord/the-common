'use client'

import { useCookieConsent } from '@/context/CookieConsentContext'
import Link from 'next/link'

export default function CookieConsentBar() {
  const { acceptCookies, hasConsented, isReady } = useCookieConsent()

  if (!isReady || hasConsented) return null

  return (
    <div
      className="cookie-consent fadeEntry"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      aria-live="polite"
    >
      <div className="cookie-consent__inner">
        <h2
          id="cookie-consent-title"
          className="cookie-consent__title type-d-text-link type-m-body-s letter-spacing-002 weight-medium"
        >
          THIS WEBSITE IS USING COOKIES
        </h2>

        <div className="cookie-consent__body">
          <p
            id="cookie-consent-description"
            className="cookie-consent__description type-d-text-link type-m-body-s letter-spacing-002"
          >
            <span className="show-md">
              We use them to give you the best experience. If you continue using our website, we’ll
              assume that you are happy to receive <Link href="/privacy-policy">all cookies</Link>{' '}
              on this website.
            </span>
            <span className="hidden-device-md">
              If you continue using our website, we’ll assume that you are happy to receive{' '}
              <Link href="/privacy-policy">all cookies</Link> cookies on this website.
            </span>
          </p>

          <button
            type="button"
            className="button-template cookie-consent__accept"
            style={{ '--button-bg-color': 'var(--color-saladaeng-orange)' } as React.CSSProperties}
            onClick={acceptCookies}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  )
}
