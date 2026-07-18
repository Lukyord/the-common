import { GridCardContainer } from '@/components/branch/GridCardContainer'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { generateMeta } from '@/lib/generateMeta'
import { getGlobalWhatsOnArchived } from '@/payload/queries/branch'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    fallbackTitle: 'Event Archive | The Common',
    fallbackDescription: 'Event Archive at The Common',
    pathname: '/whats-on/archive',
  })
}

export default async function WhatsOnArchivePage() {
  const archiveResult = await getGlobalWhatsOnArchived()

  return (
    <main id="main" className="branch-archive-page">
      <section data-section="archive" className="bg-beige header-padding">
        <div className="sc-inner pc-t-150 pc-b-100 mb-t-100 mb-b-50">
          <GridCardContainer
            cardVariant="whats-on"
            cardContext={{
              branchSlug: '',
              backgroundColor: 'var(--color-beige)',
            }}
            backLink={{ href: '/whats-on' }}
            title="EVENT ARCHIVE"
            showSort
            cards={archiveResult.cards}
            hasMore={archiveResult.hasMore}
            loadMoreUrl="/api/cards/whats-on-archive"
            emptyMessage="No archived events yet."
          />
        </div>
      </section>

      <AnimateOnScroll triggerClass="fadeIn">
        <Link
          href="/whats-on"
          className="banner-button reverse c-dark-brown"
          style={{ '--button-bg-color': 'var(--color-saladaeng-orange)' } as React.CSSProperties}
        >
          <p className="type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002">
            <span>BACK TO WHAT’S ON</span>
          </p>

          <i className="ic ic-body-arrow-right"></i>
        </Link>
      </AnimateOnScroll>
    </main>
  )
}
