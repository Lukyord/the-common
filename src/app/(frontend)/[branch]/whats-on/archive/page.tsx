import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { GridCardContainer } from '@/components/branch/GridCardContainer'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getBranchWhatsOnArchived,
  getBranchWhatsOnPageBySlug,
} from '@/payload/queries/branch'
import type { Metadata } from 'next'
import Link from 'next/link'
import React, { type CSSProperties } from 'react'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch } = await params
  const page = await getBranchWhatsOnPageBySlug(branch)
  const branchName = typeof page.branch === 'object' ? page.branch.name : null

  return generateMeta({
    fallbackTitle: branchName ? `Event Archive | ${branchName}` : 'Event Archive',
    fallbackDescription: branchName
      ? `Event Archive at ${branchName}`
      : 'Event Archive at The Common',
  })
}

export default async function ArchivePage({ params }: Props) {
  const { branch: branchSlug } = await params
  const branch = await getBranchBySlug(branchSlug)
  const [page, archiveResult] = await Promise.all([
    getBranchWhatsOnPageBySlug(branchSlug),
    getBranchWhatsOnArchived(branch),
  ])
  const eventArchiveBackground = page.allEventsAndWorkshops?.eventArchiveBackground
  const eventArchiveTextColor = page.allEventsAndWorkshops?.eventArchiveTextColor

  return (
    <main id="main" className="branch-archive-page">
      <section data-section="archive" className="bg-beige header-padding">
        <div className="sc-inner pc-t-150 pc-b-100 mb-t-100 mb-b-50">
          <GridCardContainer
            cardVariant="whats-on"
            cardContext={{
              branchSlug,
              themeColor:
                branch.bgColor && branch.primaryColor
                  ? { bgColor: branch.bgColor, color: branch.primaryColor }
                  : undefined,
              backgroundColor: 'var(--color-beige)',
            }}
            backLink={{ href: `/${branchSlug}/whats-on` }}
            title="EVENT ARCHIVE"
            // showCount
            showSort
            // showBranchFilter
            // showCategoryFilter
            cards={archiveResult.cards}
            hasMore={archiveResult.hasMore}
            loadMoreUrl="/api/cards/whats-on-archive"
            loadMoreParams={{ branch: branchSlug }}
            emptyMessage="No archived events yet."
          />
        </div>
      </section>

      <AnimateOnScroll triggerClass="fadeIn">
        <Link
          href={`/${branchSlug}/whats-on`}
          className="banner-button reverse"
          style={
            {
              '--button-bg-color': eventArchiveBackground,
              '--button-text-color': eventArchiveTextColor,
            } as CSSProperties
          }
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
