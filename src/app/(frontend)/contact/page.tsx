import React from 'react'
import type { Metadata } from 'next'

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
  const { contact, error } = await getContactPayloadData()
  const subjects = contact?.contactSubject?.filter(Boolean) ?? []

  return (
    <main id="main" className="contact-page">
      <section aria-labelledby="contact-title">
        <h1 id="contact-title">Contact</h1>

        {error ? <p>Contact data could not be loaded.</p> : null}

        {subjects.map((subject) => (
          <p key={subject}>{subject}</p>
        ))}
      </section>
    </main>
  )
}
