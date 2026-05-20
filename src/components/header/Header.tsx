import { headers } from 'next/headers'

import './header.css'

import { Logo } from './Logo'
import HeaderMenuCtrl from './HeaderMenuCtrl'
import Link from 'next/link'
import { HeaderLocation } from './HeaderLocation'

const HEADER_NAV_ITEMS = [
  { href: '/about', label: 'ABOUT' },
  { href: '/whats-on', label: "WHAT'S ON" },
  { href: '/vendors', label: 'VENDORS' },
  { href: '/blogs', label: 'BLOG' },
  { href: '/space-rental', label: 'SPACE RENTAL' },
  { href: '/contact', label: 'CONTACT' },
] as const

function getSlugFromPathname(pathname: string): string {
  if (pathname === '/') return ''
  return pathname.split('/').filter(Boolean)[0] ?? ''
}

export async function Header() {
  const pathname = (await headers()).get('x-pathname') ?? '/'
  const slug = getSlugFromPathname(pathname)

  return (
    <header id="header">
      <div className="header-nav">
        <div className="header-logo">
          <Logo />
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
                        className="type-d-label type-m-title uppercase weight-medium"
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
