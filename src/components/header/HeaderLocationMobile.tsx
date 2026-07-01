'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getSlugFromPathname } from '@/lib/pathname'
import RenderMedia from '../common/media'
import type { HeaderBranchItem } from './header-types'

const BRAND_LOGO = '/designs/brand-logo.webp'

type props = {
  className?: string
  branches: HeaderBranchItem[]
  setIsMenuOpen: (isOpen: boolean) => void
}

export const HeaderLocationMobile = ({ className, setIsMenuOpen, branches }: props) => {
  const pathname = usePathname()
  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const choiceBranches = currentBranch
    ? branches.filter((branch) => branch.slug !== currentBranch.slug)
    : branches

  const close = () => setIsMenuOpen(false)

  const showBrand = Boolean(currentBranch)
  const hasItems = showBrand || choiceBranches.length > 0

  if (!hasItems) return null

  return (
    <div className={`header-location-mobile ${className ?? ''}`}>
      <div className="header-location-mobile__items">
        {showBrand && (
          <div className="header-location-mobile__item">
            <Link href="/" onClick={close} className="link-overlay" aria-label="theCOMMONS">
              &nbsp;
            </Link>
            <div className="branch-media">
              <RenderMedia src={BRAND_LOGO} alt="theCOMMONS" />
            </div>
            <div className="branch-name">
              <h3 className="type-d-label type-m-body-s weight-medium letter-spacing-002">
                theCOMMONS
              </h3>
              <i className="ic ic-arrow-square-top-right size-icon-5xs"></i>
            </div>
          </div>
        )}
        {choiceBranches.map((branch) => (
          <div className="header-location-mobile__item" key={branch.slug}>
            <Link
              href={`/${branch.slug}`}
              onClick={close}
              className="link-overlay"
              aria-label={branch.name}
            >
              &nbsp;
            </Link>
            {branch.logo?.src && (
              <div className="branch-media">
                <RenderMedia src={branch.logo.src} alt={branch.logo.alt || branch.name} />
              </div>
            )}
            <div className="branch-name">
              <h3 className="type-d-label type-m-body-s weight-medium letter-spacing-002">
                {branch.name.toUpperCase()}
              </h3>
              <i className="ic ic-arrow-square-top-right size-icon-5xs"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
