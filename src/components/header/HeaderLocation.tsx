'use client'

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
        <p className="type-d-label uppercase weight-medium">LOCATION</p>

        <i className="ic ic-chevron-down size-icon-3xs"></i>
      </button>

      <div className="location-panel">
        <div className="location-panel-inner">
          <ul>
            <li>
              <p className="location-label type-d-label weight-medium">theCOMMONS</p>
            </li>
            <li>
              <a href="/thonglor" className="type-d-label uppercase weight-medium">
                THONGLOR
              </a>
            </li>
            <li>
              <a href="/saladaeng" className="type-d-label uppercase weight-medium">
                SALADAENG
              </a>
            </li>
            <li>
              <a href="/cloud-11" className="type-d-label uppercase weight-medium">
                CLOUD 11
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
