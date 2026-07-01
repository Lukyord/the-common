'use client'

import { BranchShape } from '@/components/elements/BranchShape'
import { getHeaderLocationSelectorColors, isHeaderLocationTarget } from '@/constants/headerLocationSelectorThemes'
import { LOCATIONS } from '@/constants/locations'
import Link from 'next/link'
import { useState } from 'react'

export const LocationSelector = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`show-md entryTranslateY location-selector ${isOpen ? ' is-open' : ''}`}>
      <div className="location-selector__inner">
        <button
          type="button"
          className="location-selector__label"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <p className="type-d-label type-m-body-m letter-spacing-003 uppercase weight-medium">
            PICK LOCATION
          </p>
          <i className="ic ic-arrow-down size-icon-2xs hidden-device-md c-beige" aria-hidden></i>
        </button>

        <div className="location-items">
          <div className="location-items__inner">
            {LOCATIONS.map((location) => {
              if (!isHeaderLocationTarget(location.slug)) return null

              const colors = getHeaderLocationSelectorColors('brand', location.slug)

              return (
              <div className="location-selector__item" key={location.branch}>
                <Link href={location.href} className="link-overlay" aria-label={location.name}>
                  &nbsp;
                </Link>
                <BranchShape branch={location.branch} mainColor={colors.iconColor} />
                <div className="item-text">
                  <div className="item-header">
                    <div className="item-ttl">
                      <h3
                        className="type-d-label type-m-body-s letter-spacing-003 uppercase weight-medium"
                        style={{ color: colors.titleColor }}
                      >
                        {location.name}
                      </h3>
                    </div>
                    <i className="ic ic-arrow-square-top-right size-icon-3xs" aria-hidden />
                  </div>
                  {location.captions.map((caption) => (
                    <p
                      key={caption}
                      className="type-caption letter-spacing-002"
                      style={{ color: colors.textColor }}
                    >
                      {caption}
                    </p>
                  ))}
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  )
}
