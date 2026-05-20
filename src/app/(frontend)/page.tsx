import React from 'react'
import type { Metadata } from 'next'

import HorizontalMarquee from '@/components/common/horizontal-marquee'
import { generateMeta } from '@/lib/generateMeta'
import { getHomePayloadData } from '@/payload/queries/home'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { homepage } = await getHomePayloadData()

  return generateMeta({
    meta: homepage?.meta,
    fallbackTitle: homepage?.hero?.title,
    fallbackDescription: homepage?.about?.description,
  })
}

export default async function HomePage() {
  const { contact, errors, homepage, lifestyles } = await getHomePayloadData()
  const mottoItems = homepage?.motto?.filter((item) => item.text?.trim()) ?? []

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
      <section data-section="index-hero">
        <div className="sc-inner">
          <div className="container">
            <div className="location-selector">
              <div className="location-selector__label">
                <p className="type-d-label type-m-body-m letter-spacing-003 uppercase weight-medium">
                  SELECT LOCATION
                </p>
              </div>

              <div className="location-selector__item">
                <div className="item-header">
                  <div className="item-ttl">
                    <h3 className="type-d-label type-m-body-m letter-spacing-003 uppercase weight-medium"></h3>
                  </div>

                  <i className="ic ic-arrow-topright"></i>
                </div>

                <p className="type-caption">OPENING HOURS</p>

                <p className="type-caption">8am - 1am</p>
              </div>
              <div className="location-selector__item"></div>
              <div className="location-selector__item"></div>
            </div>
          </div>
        </div>
      </section>

      {mottoItems.length > 0 && (
        <div className="motto-marquee">
          <HorizontalMarquee speed={25} direction="left">
            <div className="motto-marquee__strip">
              {mottoItems.map((item, index) => (
                <div key={item.id ?? index} className="motto-marquee__item">
                  <span className="shape" data-shape={item.shape}></span>
                  <span className="type-d-body-m type-m-body-r letter-spacing-003">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </HorizontalMarquee>
        </div>
      )}

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

      <div style={{ height: '300vh' }}></div>
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
