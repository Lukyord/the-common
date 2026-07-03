'use client'

import { AllLocationSvgIcon } from '@/components/elements/AllLocationSvgIcon'
import { BranchShape } from '@/components/elements/BranchShape'
import { BranchSvgIcon, isBranchSvgSlug } from '@/components/elements/BranchSvgIcon'
import {
  getHeaderLocationSelectorColors,
  getHeaderLocationSelectorContext,
  isHeaderLocationTarget,
} from '@/constants/headerLocationSelectorThemes'
import { LOCATION_BY_SLUG } from '@/constants/locations'
import type { LocationThemeColors } from '@/constants/headerLocationSelectorThemes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

import { getSlugFromPathname } from '@/lib/pathname'
import type { HeaderBranchItem } from './header-types'

type HeaderLocationSelectorMobileProps = {
  branches: HeaderBranchItem[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

function locationThemeStyle(colors: LocationThemeColors): CSSProperties {
  return {
    '--location-icon-color': colors.iconColor,
    '--location-title-color': colors.titleColor,
    '--location-text-color': colors.textColor,
  } as CSSProperties
}

export function HeaderLocationSelectorMobile({
  branches,
  isOpen,
  setIsOpen,
}: HeaderLocationSelectorMobileProps) {
  const pathname = usePathname()
  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const context = getHeaderLocationSelectorContext(currentBranch?.slug)
  const triggerTarget =
    currentBranch?.slug && isHeaderLocationTarget(currentBranch.slug) ? currentBranch.slug : 'brand'
  const choiceBranches = currentBranch
    ? branches.filter((branch) => branch.slug !== currentBranch.slug)
    : branches

  const triggerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setHeaderEl(document.getElementById('header'))
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, setIsOpen])

  const close = () => setIsOpen(false)
  const triggerTheme = getHeaderLocationSelectorColors(context, triggerTarget)
  const brandTheme = getHeaderLocationSelectorColors(context, 'brand')
  const showAllLocations = Boolean(currentBranch)
  const hasItems = showAllLocations || choiceBranches.length > 0

  if (!hasItems) return null

  const panel = (
    <div
      ref={panelRef}
      className={`hidden-device-md header-location-selector-mobile__panel${isOpen ? ' is-open' : ''}`}
    >
      <div className="header-location-selector-mobile__panel-inner">
        <div className="header-location-selector-mobile__items-wrap">
          <div className="header-location-selector-mobile__items">
            {showAllLocations && (
              <div
                className="header-location-selector-mobile__item"
                style={locationThemeStyle(brandTheme)}
              >
                <Link href="/" onClick={close} className="link-overlay" aria-label="All locations">
                  &nbsp;
                </Link>
                <div className="all-location-icon">
                  <AllLocationSvgIcon color={brandTheme.iconColor} />
                </div>
                <div className="item-text">
                  <div className="item-header">
                    <div className="item-ttl">
                      <h3 className="header-location-selector-mobile__title type-d-label type-m-body-s letter-spacing-003 uppercase weight-medium">
                        All locations
                      </h3>
                    </div>
                    <i className="ic ic-arrow-square-top-right size-icon-3xs" aria-hidden />
                  </div>
                </div>
              </div>
            )}
            {choiceBranches.map((branch) => {
              const location = LOCATION_BY_SLUG[branch.slug]
              if (!location || !isHeaderLocationTarget(branch.slug)) return null

              const itemTheme = getHeaderLocationSelectorColors(context, branch.slug)

              return (
                <div
                  className="header-location-selector-mobile__item"
                  key={branch.slug}
                  style={locationThemeStyle(itemTheme)}
                >
                  <Link
                    href={location.href}
                    onClick={close}
                    className="link-overlay"
                    aria-label={location.name}
                  >
                    &nbsp;
                  </Link>
                  <BranchShape branch={location.branch} mainColor={itemTheme.iconColor} />
                  <div className="item-text">
                    <div className="item-header">
                      <div className="item-ttl">
                        <h3 className="header-location-selector-mobile__title type-d-label type-m-body-s letter-spacing-003 uppercase weight-medium">
                          {location.name}
                        </h3>
                      </div>
                      <i className="ic ic-arrow-square-top-right size-icon-3xs" aria-hidden />
                    </div>
                    {location.captions.map((caption) => (
                      <p
                        key={caption}
                        className="header-location-selector-mobile__text type-caption letter-spacing-002"
                      >
                        {caption}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div
        ref={triggerRef}
        className={`header-location-selector-mobile hidden-device-md${isOpen ? ' is-open' : ''}`}
        style={locationThemeStyle(triggerTheme)}
      >
        <button
          type="button"
          className="header-location-selector-mobile__trigger"
          aria-expanded={isOpen}
          aria-label={currentBranch ? `${currentBranch.name} location` : 'Location'}
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentBranch && isBranchSvgSlug(currentBranch.slug) ? (
            <BranchSvgIcon branch={currentBranch.slug} color={triggerTheme.iconColor} />
          ) : (
            <span className="header-location-selector-mobile__title type-d-label type-m-body-r letter-spacing-003 uppercase weight-medium">
              LOCATION
            </span>
          )}
          <i className="ic ic-arrow-down size-icon-2xs" aria-hidden />
        </button>
      </div>

      {headerEl ? createPortal(panel, headerEl) : null}
    </>
  )
}
