'use client'

import { usePathname } from 'next/navigation'

import { branchFooterThemeStyle } from '@/lib/branchTheme'
import { getSlugFromPathname, isFooterHiddenPathname } from '@/lib/pathname'
import { FooterLeft } from './FooterLeft'
import { FooterMiddle } from './FooterMiddle'
import { FooterRight } from './FooterRight'
import type { FooterBranchItem, FooterContact } from './footer-types'
import { mergeFooterSocials } from './footer-utils'

type FooterClientProps = {
  branches: FooterBranchItem[]
  contact: FooterContact
}

export function FooterClient({ branches, contact }: FooterClientProps) {
  const pathname = usePathname()

  if (isFooterHiddenPathname(pathname)) {
    return null
  }

  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const footerBranches = currentBranch
    ? branches.filter((branch) => branch.id !== currentBranch.id)
    : branches
  const footerContact: FooterContact = currentBranch
    ? { ...contact, ...mergeFooterSocials(contact, currentBranch.social) }
    : contact
  const faqHref = currentBranch ? `/${currentBranch.slug}/contact` : '/contact'

  return (
    <footer
      id="footer"
      className={currentBranch ? 'footer--branch' : 'footer--brand'}
      style={branchFooterThemeStyle(currentBranch)}
    >
      <div className="footer-nav">
        <FooterLeft currentBranch={currentBranch} branches={footerBranches} contact={contact} />
        {currentBranch && <FooterMiddle branch={currentBranch} />}
        <FooterRight contact={footerContact} faqHref={faqHref} />
      </div>
    </footer>
  )
}
