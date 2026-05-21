import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { BranchShape } from '@/components/elements/BranchShape'
import Link from 'next/link'
import type { ComponentProps } from 'react'

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
  return (
    <AnimateOnScroll className="location-selector" triggerClass="entryTranslateY">
      <div className="location-selector__inner">
        <div className="location-selector__label">
          <p className="type-d-label type-m-body-m letter-spacing-003 uppercase weight-medium">
            SELECT LOCATION
          </p>
        </div>
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
                    className="type-d-label type-m-body-m letter-spacing-003 uppercase weight-medium"
                    style={{ color: location.accentColor }}
                  >
                    {location.name}
                  </h3>
                </div>
                <i className="ic ic-arrow-right size-icon-3xs" aria-hidden />
              </div>
              {location.captions.map((caption) => (
                <p key={caption} className="type-caption letter-spacing-003">
                  {caption}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AnimateOnScroll>
  )
}
