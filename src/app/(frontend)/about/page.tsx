import React from 'react'
import type { Metadata } from 'next'

import { AwardsSection, toAwardsData } from '@/components/brand/about/AwardsSection'
import { ReSection } from '@/components/brand/about/ReSection'
import { InfoSection, toInfoBlocks } from '@/components/brand/homepage/about'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import { generateMeta } from '@/lib/generateMeta'
import { resolveMedia } from '@/lib/resolveMedia'
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
  const { about } = await getAboutPayloadData()
  const { hero, info, awards } = about
  const heroBackground = resolveMedia(hero?.backgroundMedia)
  const heroBackgroundMobile = resolveMedia(hero?.mobileBackgroundMedia)
  const infoBlocks = info?.length ? toInfoBlocks(info) : []
  const [firstInfoBlock, ...moreInfoBlocks] = infoBlocks
  const awardsData = toAwardsData(awards)

  return (
    <main id="main" className="about-page">
      {/* ABOUT HERO ==================== */}
      <section data-section="page-hero" className="bg-dark-brown">
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
        <div className="sc-inner pc-t-100 pc-b-75 mb-t-100 mb-b-100">
          <div className="container">
            <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h1"
                inline
                className="type-d-display type-m-display weight-medium"
              >
                {hero?.title}
              </MarkdownContent>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {firstInfoBlock && <InfoSection block={firstInfoBlock} priority className="full-screen" />}

      <ReSection />

      {moreInfoBlocks.map((block, index) => (
        <InfoSection
          key={block.id}
          block={block}
          reverse={index % 2 === 0}
          className="full-screen"
        />
      ))}

      <AwardsSection {...awardsData} />
    </main>
  )
}
