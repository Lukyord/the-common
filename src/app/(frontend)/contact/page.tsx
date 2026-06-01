import type { Metadata } from 'next'

import ContactForm, { toContactFormProps } from '@/components/brand/contact/ContactForm'
import ContactAccordionContainer, {
  toContactAccordionProps,
} from '@/components/brand/contact/ContactAccordionContainer'
import { generateMeta } from '@/lib/generateMeta'
import { getContactPayloadData } from '@/payload/queries/contact'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getContactPayloadData()

  return generateMeta({
    meta: contact?.meta,
    fallbackTitle: 'Contact | The Common',
    fallbackDescription: 'Contact The Common',
  })
}

export default async function ContactPage() {
  const { contact } = await getContactPayloadData()

  return (
    <main id="main" className="contact-page">
      <ContactForm {...toContactFormProps(contact)} />

      <ContactAccordionContainer {...toContactAccordionProps(contact)} />
    </main>
  )
}
