'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { branchHeaderThemeStyle } from '@/lib/branchTheme'
import { getSlugFromPathname } from '@/lib/pathname'
import { Logo } from './Logo'
import HeaderMenuCtrl from './HeaderMenuCtrl'
import { HeaderLocation } from './HeaderLocation'
import type { HeaderBranchItem } from './header-types'
import { HeaderLocationMobile } from './HeaderLocationMobile'

const BRAND_HEADER_NAV_ITEMS = [
  { href: '/about', label: 'ABOUT' },
  { href: '/whats-on', label: "WHAT'S ON" },
  { href: '/vendors', label: 'VENDORS' },
  { href: '/blogs', label: 'BLOG' },
  { href: '/space-rental', label: 'SPACE RENTAL' },
  { href: '/contact', label: 'CONTACT' },
] as const

const BRANCH_HEADER_NAV_SEGMENTS = [
  { segment: 'whats-on', label: "WHAT'S ON" },
  { segment: 'vendors', label: 'VENDORS' },
  { segment: 'space-rental', label: 'SPACE RENTAL' },
  { segment: 'contact', label: 'CONTACT' },
] as const

type HeaderClientProps = {
  branches: HeaderBranchItem[]
}

export function HeaderClient({ branches }: HeaderClientProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const themeStyle = branchHeaderThemeStyle(currentBranch)
  const headerNavItems = currentBranch
    ? BRANCH_HEADER_NAV_SEGMENTS.map(({ segment, label }) => ({
        href: `/${currentBranch.slug}/${segment}`,
        label,
      }))
    : BRAND_HEADER_NAV_ITEMS

  return (
    <header
      id="header"
      style={themeStyle}
      className={currentBranch ? 'header--branch' : 'header--brand'}
    >
      <div className="header-nav">
        <div className="header-logo">
          <Logo color={currentBranch?.primaryColor ?? undefined} />
        </div>

        <nav className="header-menu">
          <div className="panel">
            <div className="panel-scroll" data-lenis-prevent>
              <div className="panel-body">
                <ul className="menu">
                  {headerNavItems.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="type-d-label type-m-title letter-spacing-003 uppercase weight-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <HeaderLocationMobile
                  className="hidden-device-md"
                  branches={branches}
                  setIsMenuOpen={setIsMenuOpen}
                />
              </div>
            </div>
          </div>
        </nav>

        <div className="header-cta">
          <HeaderLocation className="show-md" branches={branches} />

          <HeaderMenuCtrl isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </header>
  )
}
