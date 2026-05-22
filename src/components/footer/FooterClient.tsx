'use client'

import { usePathname } from 'next/navigation'

import { branchFooterThemeStyle } from '@/lib/branchTheme'
import { getSlugFromPathname } from '@/lib/pathname'
import { FooterLeft } from './FooterLeft'
import { FooterMiddle } from './FooterMiddle'
import { FooterRight } from './FooterRight'
import type { FooterBranchItem, FooterContact } from './footer-types'

type FooterClientProps = {
  branches: FooterBranchItem[]
  contact: FooterContact
}

export function FooterClient({ branches, contact }: FooterClientProps) {
  const pathname = usePathname()
  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const footerBranches = currentBranch
    ? branches.filter((branch) => branch.id !== currentBranch.id)
    : branches

  return (
    <footer
      id="footer"
      className={currentBranch ? 'footer--branch' : 'footer--brand'}
      style={branchFooterThemeStyle(currentBranch)}
    >
      <div className="footer-nav">
        <FooterLeft currentBranch={currentBranch} branches={footerBranches} contact={contact} />
        {currentBranch && <FooterMiddle branch={currentBranch} />}
        <FooterRight contact={contact} />
      </div>
    </footer>
  )
}
