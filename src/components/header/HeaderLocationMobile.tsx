'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'

import { useClickOutside } from '@/hooks/useClickOutside'
import { getSlugFromPathname } from '@/lib/pathname'
import type { HeaderBranchItem } from './header-types'

type props = {
  className?: string
  branches: HeaderBranchItem[]
  setIsMenuOpen: (isOpen: boolean) => void
}

export const HeaderLocationMobile = ({ className, setIsMenuOpen, branches }: props) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const choiceBranches = currentBranch
    ? branches.filter((branch) => branch.slug !== currentBranch.slug)
    : branches

  const close = () => {
    setIsOpen(false)
    setIsMenuOpen(false)
  }
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, () => setIsOpen(false), isOpen)

  return (
    <div
      ref={containerRef}
      className={`header-location header-location-mobile ${isOpen ? ' is-open' : ''} ${className}`}
    >
      <div className="location-trigger">
        <p className="type-d-label type-m-title letter-spacing-003">Location</p>

        <div className="location-trigger-wrapper">
          <button
            type="button"
            className="location-trigger-inner"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <div className="current">
              <p className="type-m-body-m letter-spacing-002 weight-medium">
                {currentBranch?.name ?? 'theCOMMONS'}
              </p>
            </div>

            <i className="ic ic-chevron-down size-icon-3xs"></i>
          </button>

          <div className="location-panel">
            <div className="location-panel-inner">
              <ul>
                {currentBranch && (
                  <li>
                    <Link
                      href="/"
                      onClick={close}
                      className="type-m-body-m letter-spacing-002 weight-medium"
                    >
                      theCOMMONS
                    </Link>
                  </li>
                )}
                {choiceBranches.map((branch) => (
                  <li key={branch.slug}>
                    <Link
                      href={`/${branch.slug}`}
                      onClick={close}
                      className="type-m-body-m letter-spacing-002 weight-medium uppercase"
                    >
                      {branch.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
