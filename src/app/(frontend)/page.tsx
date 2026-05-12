import React from 'react'

import { getHomePayloadData } from '@/payload/queries/home'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { contact, errors, lifestyles } = await getHomePayloadData()
  const hasContact = Boolean(
    contact?.email ||
    contact?.tel ||
    contact?.kinnestGroup ||
    contact?.social?.instagram ||
    contact?.social?.facebook ||
    contact?.social?.line,
  )

  return (
    <main id="main" className="index-page">
      <section aria-labelledby="payload-data-title">
        <p>Payload test</p>
        <h1 id="payload-data-title">Homepage Data</h1>

        <section aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>

          {errors.contact ? (
            <p>Contact data could not be loaded.</p>
          ) : hasContact ? (
            <dl>
              <ContactRow label="Email" value={contact?.email} href={toEmailHref(contact?.email)} />
              <ContactRow label="Tel" value={contact?.tel} href={toTelHref(contact?.tel)} />
              <ContactRow label="Kinnest Group" value={contact?.kinnestGroup} />
              <ContactRow
                label="Instagram"
                value={contact?.social?.instagram}
                href={toExternalHref(contact?.social?.instagram)}
              />
              <ContactRow
                label="Facebook"
                value={contact?.social?.facebook}
                href={toExternalHref(contact?.social?.facebook)}
              />
              <ContactRow
                label="Line"
                value={contact?.social?.line}
                href={toExternalHref(contact?.social?.line)}
              />
            </dl>
          ) : (
            <p>No contact data yet.</p>
          )}
        </section>

        <section aria-labelledby="lifestyle-title">
          <h2 id="lifestyle-title">Lifestyle</h2>

          {errors.lifestyle ? (
            <p>Lifestyle data could not be loaded. Make sure its migration has been applied.</p>
          ) : lifestyles.length > 0 ? (
            <ul>
              {lifestyles.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          ) : (
            <p>No lifestyle data yet.</p>
          )}
        </section>
      </section>
    </main>
  )
}

type ContactRowProps = {
  href?: string
  label: string
  value?: string | null
}

function ContactRow({ href, label, value }: ContactRowProps) {
  if (!value) {
    return null
  }

  return (
    <div>
      <dt>{label}</dt>
      <dd>{href ? <a href={href}>{value}</a> : value}</dd>
    </div>
  )
}

function toEmailHref(value?: string | null) {
  return value ? `mailto:${value}` : undefined
}

function toTelHref(value?: string | null) {
  return value ? `tel:${value.replace(/\s/g, '')}` : undefined
}

function toExternalHref(value?: string | null) {
  return value?.startsWith('http') ? value : undefined
}
