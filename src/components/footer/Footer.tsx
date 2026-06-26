import './footer.css'

import { lexicalToHtml } from '@/lib/lexicalToHtml'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Branch, BranchContactPage } from '@/payload-types'
import { getBranchContactPages, getBranches } from '@/payload/queries/branch'
import { getContactPayloadData } from '@/payload/queries/contact'
import { FooterClient } from './FooterClient'
import type { FooterBranchInfoSection, FooterBranchItem, FooterContact } from './footer-types'

const BRANCH_INFO_SECTIONS = [
  { title: 'Find Us', field: 'findUs' },
  { title: 'Opening Hours', field: 'openingHours' },
  { title: 'Parking Options', field: 'parkingOptions' },
] as const satisfies ReadonlyArray<{
  title: string
  field: keyof Pick<Branch, 'findUs' | 'openingHours' | 'parkingOptions'>
}>

export async function Footer() {
  const [{ contact }, branches, branchContactPages] = await Promise.all([
    getContactPayloadData(),
    getBranches(),
    getBranchContactPages(),
  ])

  const contactPagesByBranchId = new Map(
    branchContactPages.map((page) => {
      const branchId = typeof page.branch === 'number' ? page.branch : page.branch.id
      return [branchId, page] as const
    }),
  )

  return (
    <FooterClient
      branches={branches.map((branch) =>
        toFooterBranchItem(branch, contactPagesByBranchId.get(branch.id)),
      )}
      contact={toFooterContact(contact)}
    />
  )
}

function toFooterSocial(social?: BranchContactPage['social'] | null) {
  if (!social) return null

  return {
    instagram: social.instagram ?? null,
    facebook: social.facebook ?? null,
    line: social.line ?? null,
  }
}

function toFooterBranchItem(branch: Branch, contactPage?: BranchContactPage): FooterBranchItem {
  const logo = resolveMedia(branch.logo)

  return {
    id: branch.id,
    slug: branch.slug,
    name: branch.name,
    tel: branch.tel ?? null,
    footerBg: branch.footerBg ?? null,
    footerColor: branch.footerColor ?? null,
    logo: logo?.src ? { src: logo.src, alt: logo.alt || branch.name } : null,
    infoSections: BRANCH_INFO_SECTIONS.flatMap(({ title, field }) => {
      const html = lexicalToHtml(branch[field])
      if (!html) return []

      return [{ title, field, html } satisfies FooterBranchInfoSection]
    }),
    social: toFooterSocial(contactPage?.social),
  }
}

function toFooterContact(contact: Awaited<ReturnType<typeof getContactPayloadData>>['contact']): FooterContact {
  return {
    email: contact?.email ?? null,
    kinnestGroup: contact?.kinnestGroup ?? null,
    instagram: contact?.social?.instagram ?? null,
    facebook: contact?.social?.facebook ?? null,
    line: contact?.social?.line ?? null,
  }
}
