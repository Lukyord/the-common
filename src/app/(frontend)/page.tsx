import React from 'react'
import type { Metadata } from 'next'

import { FlexibleSection } from '@/components/brand/homepage/FlexibleSection'
import { MarkdownContent } from '@/components/common/markdown-content'
import RenderMedia from '@/components/common/media'
import { MottoMarquee } from '@/components/elements/MottoMarquee'
import { generateMeta } from '@/lib/generateMeta'
import { resolveMedia } from '@/lib/resolveMedia'
import { getHomePayloadData } from '@/payload/queries/home'
import { LocationSelector } from '@/components/brand/homepage/LocationSelector'
import { ScrollShapeSection } from '@/components/brand/homepage/ScrollShapeSection'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { homepage } = await getHomePayloadData()

  return generateMeta({
    meta: homepage?.meta,
    fallbackTitle: homepage?.hero?.title?.replace(/\s+/g, ' ').trim(),
    fallbackDescription: homepage?.about?.description,
  })
}

export default async function HomePage() {
  const { homepage } = await getHomePayloadData()
  const { hero } = homepage
  const heroBackground = resolveMedia(hero?.backgroundMedia)
  const heroBackgroundMobile = resolveMedia(hero?.mobileBackgroundMedia)
  return (
    <main id="main" className="index-page">
      {/* HOMEPAGE HERO ==================== */}
      <section data-section="index-hero" className="bg-dark-brown">
        <div className="cover">
          {heroBackground?.src && (
            <RenderMedia
              src={heroBackground.src}
              srcMobile={heroBackgroundMobile?.src || heroBackground.src}
              alt={heroBackground.alt}
              priority
            />
          )}
        </div>
        <div className="sc-inner pc-t-100 pc-b-75 mb-t-100 mb-b-50">
          <div className="container">
            <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h1"
                inline
                markdown={homepage.hero.title}
                className="type-d-display type-m-display weight-medium"
              />
            </AnimateOnScroll>
          </div>
        </div>

        <LocationSelector />
      </section>

      <MottoMarquee items={homepage?.motto} />

      <ScrollShapeSection data={homepage?.peopleOfTheCommons} />

      <FlexibleSection show={homepage?.flexibleSectionShow} items={homepage?.flexibleSection} />

      <div style={{ height: '100vh' }}></div>
    </main>
  )
}
