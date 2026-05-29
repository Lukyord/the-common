'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

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
  const choiceBranches = currentBranch
    ? branches.filter((branch) => branch.slug !== currentBranch.slug)
    : branches

  const close = () => setIsOpen(false)

  return (
    <div className={`header-location ${isOpen ? ' is-open' : ''} ${className}`}>
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
              <p className="location-label type-d-label letter-spacing-003 weight-medium uppercase">
                {currentBranch?.name ?? 'theCOMMONS'}
              </p>
            </li>
            {choiceBranches.map((branch) => (
              <li key={branch.slug}>
                <Link
                  href={`/${branch.slug}`}
                  onClick={close}
                  className="type-d-label letter-spacing-003 uppercase weight-medium"
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
