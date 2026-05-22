'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { branchHeaderThemeStyle } from '@/lib/branchTheme'
import { getSlugFromPathname } from '@/lib/pathname'
import { Logo } from './Logo'
import HeaderMenuCtrl from './HeaderMenuCtrl'
import { HeaderLocation } from './HeaderLocation'
import type { HeaderBranchItem } from './header-types'

const HEADER_NAV_ITEMS = [
  { href: '/about', label: 'ABOUT' },
  { href: '/whats-on', label: "WHAT'S ON" },
  { href: '/vendors', label: 'VENDORS' },
  { href: '/blogs', label: 'BLOG' },
  { href: '/space-rental', label: 'SPACE RENTAL' },
  { href: '/contact', label: 'CONTACT' },
] as const

type HeaderClientProps = {
  branches: HeaderBranchItem[]
}

export function HeaderClient({ branches }: HeaderClientProps) {
  const pathname = usePathname()
  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const themeStyle = branchHeaderThemeStyle(currentBranch)

  return (
    <header id="header" style={themeStyle}>
      <div className="header-nav">
        <div className="header-logo">
          <Logo color={currentBranch?.primaryColor ?? undefined} />
        </div>

        <nav className="header-menu">
          <div className="panel">
            <div className="panel-scroll" data-lenis-prevent>
              <div className="panel-body">
                <ul className="menu">
                  {HEADER_NAV_ITEMS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="type-d-label type-m-title letter-spacing-003 uppercase weight-medium"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div className="header-cta">
          <HeaderLocation />

          <HeaderMenuCtrl />
        </div>
      </div>
    </header>
  )
}
