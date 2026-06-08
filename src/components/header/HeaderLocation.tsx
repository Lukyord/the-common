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
}

export const HeaderLocation = ({ className, branches }: props) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)

  const close = () => setIsOpen(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, close, isOpen)

  return (
    <div ref={containerRef} className={`header-location ${isOpen ? ' is-open' : ''} ${className}`}>
      <button
        type="button"
        className="location-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <p
          className={`${currentBranch ? 'type-d-label' : 'type-d-body-xs'} letter-spacing-003 uppercase weight-medium`}
        >
          {currentBranch ? currentBranch.name : 'PICK LOCATION'}
        </p>

        <i className="ic ic-chevron-down size-icon-3xs"></i>
      </button>

      <div className="location-panel">
        <div className="location-panel-inner">
          <ul>
            <li>
              <Link
                href={`/`}
                onClick={close}
                className={`type-d-body-xs letter-spacing-003 uppercase weight-medium ${currentBranch === null ? 'is-current' : ''}`}
              >
                theCOMMONS
              </Link>
            </li>
            {branches.map((branch) => (
              <li key={branch.slug}>
                <Link
                  href={`/${branch.slug}`}
                  onClick={close}
                  className={`type-d-body-xs letter-spacing-003 uppercase weight-medium ${currentBranch === branch ? 'is-current' : ''}`}
                >
                  {branch.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
