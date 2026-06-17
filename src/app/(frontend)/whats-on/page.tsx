import React from 'react'
import type { Metadata } from 'next'

import WhatsOnGlobalCalendar from '@/components/brand/whats-on/WhatsOnGlobalCalendar'
import WhatsOnGlobalClub from '@/components/brand/whats-on/WhatsOnGlobalClub'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import { generateMeta } from '@/lib/generateMeta'
import { resolveMedia } from '@/lib/resolveMedia'
import {
  getBranches,
  getGlobalWhatsOnByMainTag,
  getGlobalWhatsOnCalendarMonths,
} from '@/payload/queries/branch'
import { getWhatsOnPagePayloadData } from '@/payload/queries/whats-on-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { whatsOnPage } = await getWhatsOnPagePayloadData()

  return generateMeta({
    meta: whatsOnPage?.meta,
    fallbackTitle: whatsOnPage?.hero?.title || "What's On | The Common",
    fallbackDescription: "What's On at The Common",
  })
}

export default async function WhatsOnPage() {
  const [{ whatsOnPage }, branches] = await Promise.all([
    getWhatsOnPagePayloadData(),
    getBranches(),
  ])

  const clubMainTag = whatsOnPage?.club?.mainTag
  const clubMainTagId = typeof clubMainTag === 'object' ? clubMainTag?.id : clubMainTag
  const eventsMainTagIds =
    whatsOnPage?.allEventsAndWorkshops?.mainTag
      ?.map((tag) => (typeof tag === 'object' && tag ? tag.id : tag))
      .filter((id): id is number => typeof id === 'number' && Boolean(id)) ?? []

  const [clubCards, calendarMonths] = await Promise.all([
    typeof clubMainTagId === 'number' ? getGlobalWhatsOnByMainTag(clubMainTagId) : Promise.resolve([]),
    eventsMainTagIds.length
      ? getGlobalWhatsOnCalendarMonths(eventsMainTagIds)
      : Promise.resolve([]),
  ])

  const { hero, club, allEventsAndWorkshops } = whatsOnPage ?? {}
  const heroBackground = resolveMedia(hero?.backgroundMedia)
  const heroBackgroundMobile = resolveMedia(hero?.mobileBackgroundMedia)
  const branchFilters = branches
    .filter((branch) => branch.slug)
    .map((branch) => ({
      slug: branch.slug!,
      name: branch.name,
    }))

  return (
    <main id="main" className="whats-on-page">
      <section data-section="page-hero" className="bg-dark-brown">
        <div
          className="cover overlay"
          style={{ '--overlay-opacity': '0.2' } as React.CSSProperties}
        >
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

      <WhatsOnGlobalClub title={club?.title} cards={clubCards} branches={branchFilters} />

      <WhatsOnGlobalCalendar
        title={allEventsAndWorkshops?.title}
        description={allEventsAndWorkshops?.description}
        background={allEventsAndWorkshops?.background}
        eventArchiveBackground={allEventsAndWorkshops?.eventArchiveBackground}
        months={calendarMonths}
        mainTagIds={eventsMainTagIds}
      />
    </main>
  )
}
