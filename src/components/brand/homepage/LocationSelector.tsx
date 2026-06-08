'use client'

import { BranchShape } from '@/components/elements/BranchShape'
import Link from 'next/link'
import { useState, type ComponentProps } from 'react'

type Branch = ComponentProps<typeof BranchShape>['branch']

type Location = {
  branch: Branch
  href: string
  name: string
  accentColor: string
  captions: string[]
}

const LOCATIONS: Location[] = [
  {
    branch: 'thonglor',
    href: '/thonglor',
    name: 'Thonglor',
    accentColor: 'var(--color-thonglor-cyan)',
    captions: ['OPENING HOURS', '8am - 1am'],
  },
  {
    branch: 'saladaeng',
    href: '/saladaeng',
    name: 'Saladaeng',
    accentColor: 'var(--color-saladaeng-orange)',
    captions: ['OPENING HOURS', '8am - 1am'],
  },
  {
    branch: 'cloud-11',
    href: '/cloud-11',
    name: 'Cloud 11',
    accentColor: 'var(--color-cloud-11-pink)',
    captions: ['Opening Soon'],
  },
]

export const LocationSelector = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`entryTranslateY location-selector ${isOpen ? ' is-open' : ''}`}>
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
            {LOCATIONS.map((location) => (
              <div className="location-selector__item" key={location.branch}>
                <Link href={location.href} className="link-overlay" aria-label={location.name}>
                  &nbsp;
                </Link>
                <BranchShape branch={location.branch} />
                <div className="item-text">
                  <div className="item-header">
                    <div className="item-ttl">
                      <h3
                        className="type-d-label type-m-body-s letter-spacing-003 uppercase weight-medium"
                        style={{ color: location.accentColor }}
                      >
                        {location.name}
                      </h3>
                    </div>
                    <i className="ic ic-arrow-square-top-right size-icon-3xs" aria-hidden />
                  </div>
                  {location.captions.map((caption) => (
                    <p key={caption} className="type-caption letter-spacing-002">
                      {caption}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
