import type { Metadata } from 'next'

import ContactForm, { toContactFormProps } from '@/components/brand/contact/ContactForm'
import ContactAccordionContainer, {
  toContactAccordionProps,
} from '@/components/brand/contact/ContactAccordionContainer'
import { FullscreenSlide } from '@/components/brand/homepage/FullscreenSlide'
import { generateMeta } from '@/lib/generateMeta'
import { getBranchBySlug, getBranchContactPageBySlug } from '@/payload/queries/branch'
import { getHomepageMembershipData } from '@/payload/queries/home'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch } = await params
  const page = await getBranchContactPageBySlug(branch)
  const branchName = typeof page.branch === 'object' ? page.branch.name : null

  return generateMeta({
    meta: page.meta,
    fallbackTitle: page.title || (branchName ? `Contact | ${branchName}` : 'Contact'),
    fallbackDescription: branchName ? `Contact ${branchName}` : 'Contact The Common',
  })
}

export default async function ContactPage({ params }: Props) {
  const { branch: branchSlug } = await params
  const [branch, page, { membership }] = await Promise.all([
    getBranchBySlug(branchSlug),
    getBranchContactPageBySlug(branchSlug),
    getHomepageMembershipData(),
  ])

  return (
    <main id="main" className="contact-page">
      <ContactForm {...toContactFormProps(page)} branch={branch} />

      <ContactAccordionContainer {...toContactAccordionProps(page)} />

      <FullscreenSlide slides={membership} branch={branch} />
    </main>
  )
}
