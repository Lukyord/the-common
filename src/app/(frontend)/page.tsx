import type { Metadata } from 'next'

import { generateMeta } from '@/lib/generateMeta'
import { resolveMedia } from '@/lib/resolveMedia'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'

import { FlexibleSection } from '@/components/brand/homepage/FlexibleSection'
import { MarkdownContent } from '@/components/common/markdown-content'
import { MottoMarquee } from '@/components/elements/MottoMarquee'
import { getHomePayloadData } from '@/payload/queries/home'
import { LocationSelector } from '@/components/brand/homepage/LocationSelector'
import { ScrollShapeSection } from '@/components/brand/homepage/ScrollShapeSection'
import { Bingo } from '@/components/brand/homepage/bingo'
import { FullscreenSlide } from '@/components/brand/homepage/FullscreenSlide'
import { HomepageAbout } from '@/components/brand/homepage/HomepageAbout'
import { MoodSection } from '@/components/brand/homepage/mood/MoodSection'
import { resolveMoodLifestyles } from '@/components/brand/homepage/mood/resolveMoodLifestyles'

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
  const { homepage, lifestyles } = await getHomePayloadData()
  const moodLifestyles = resolveMoodLifestyles(homepage?.recommender?.lifestyles, lifestyles)
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
        <div className="sc-inner pc-t-100 pc-b-75 mb-t-100 mb-b-100">
          <div className="container">
            <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h1"
                inline
                className="type-d-display type-m-display weight-medium"
              >
                {homepage.hero.title}
              </MarkdownContent>
            </AnimateOnScroll>
          </div>
        </div>

        <LocationSelector />
      </section>

      <MottoMarquee items={homepage?.motto} />

      <HomepageAbout data={homepage?.about} />

      <ScrollShapeSection data={homepage?.peopleOfTheCommons} />

      <FlexibleSection show={homepage?.flexibleSectionShow} items={homepage?.flexibleSection} />

      <MoodSection lifestyles={moodLifestyles} />

      <FullscreenSlide slides={homepage?.membership} />

      <Bingo data={homepage?.bingo} />
    </main>
  )
}
