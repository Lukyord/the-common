import React from 'react'
import type { Metadata } from 'next'

import { generateMeta } from '@/lib/generateMeta'
import { getAboutPayloadData } from '@/payload/queries/about'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getAboutPayloadData()

  return generateMeta({
    meta: about?.meta,
    fallbackTitle: about?.hero?.title || 'About | The Common',
    fallbackDescription: 'About The Common',
  })
}

export default async function AboutPage() {
  const { about, error } = await getAboutPayloadData()
  const info = about?.info ?? []
  const awardsMedia = about?.awards?.media ?? []
  const kinnestMarqueeMedia = about?.kinnestMarquee?.media ?? []

  return (
    <main id="main" className="about-page">
      <section aria-labelledby="about-title">
        <h1 id="about-title">{about?.hero?.title || 'About'}</h1>

        {error ? <p>About data could not be loaded.</p> : null}

        {info.map((item) => (
          <p key={item.id}>{item.hexCode}</p>
        ))}

        {awardsMedia.length > 0 ? <p>Awards media: {awardsMedia.length}</p> : null}
        {kinnestMarqueeMedia.length > 0 ? (
          <p>Kinnest marquee media: {kinnestMarqueeMedia.length}</p>
        ) : null}
      </section>
    </main>
  )
}
