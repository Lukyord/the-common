'use client'

import Link from 'next/link'
import { useState } from 'react'

export const HeaderLocation = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`header-location${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        className="location-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <p className="type-d-label letter-spacing-003 uppercase weight-medium">LOCATION</p>

        <i className="ic ic-chevron-down size-icon-3xs"></i>
      </button>

      <div className="location-panel">
        <div className="location-panel-inner">
          <ul>
            <li>
              <p className="location-label type-d-label letter-spacing-003 weight-medium">
                theCOMMONS
              </p>
            </li>
            <li>
              <Link
                href="/thonglor"
                className="type-d-label letter-spacing-003 uppercase weight-medium"
              >
                THONGLOR
              </Link>
            </li>
            <li>
              <Link
                href="/saladaeng"
                className="type-d-label letter-spacing-003 uppercase weight-medium"
              >
                SALADAENG
              </Link>
            </li>
            <li>
              <Link
                href="/cloud-11"
                className="type-d-label letter-spacing-003 uppercase weight-medium"
              >
                CLOUD 11
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
