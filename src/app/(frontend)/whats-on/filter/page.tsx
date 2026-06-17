import { GridCardContainer, GRID_CARD_FILTER_ALL } from '@/components/branch/GridCardContainer'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getGlobalWhatsOnForFilter,
  getGlobalWhatsOnForFilterPage,
  resolveInitialWhatsOnTagFilter,
  resolveWhatsOnTagByText,
} from '@/payload/queries/branch'
import type { Metadata } from 'next'
import React from 'react'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ branch?: string | string[]; tag?: string | string[] }>
}

function getSearchParam(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return undefined

  const trimmed = raw.trim()
  if (!trimmed) return undefined

  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const branchSlug = getSearchParam(params.branch)
  const tag = getSearchParam(params.tag)
  const resolvedTag = tag ? await resolveWhatsOnTagByText(tag) : null
  const tagLabel = resolvedTag?.text ?? tag

  if (!branchSlug) {
    return generateMeta({
      fallbackTitle: tagLabel ? `${tagLabel} | The Common` : 'Events | The Common',
      fallbackDescription: tagLabel ? `${tagLabel} events at The Common` : 'Events at The Common',
    })
  }

  const branch = await getBranchBySlug(branchSlug)

  return generateMeta({
    fallbackTitle: tagLabel ? `${tagLabel} | ${branch.name}` : `Events | ${branch.name}`,
    fallbackDescription: tagLabel
      ? `${tagLabel} events at ${branch.name}`
      : `Events at ${branch.name}`,
  })
}

export default async function WhatsOnFilterPage({ searchParams }: Props) {
  const params = await searchParams
  const branchSlug = getSearchParam(params.branch)
  const tag = getSearchParam(params.tag)

  const branch = branchSlug ? await getBranchBySlug(branchSlug) : null
  const [filterOptionCards, resolvedTag] = await Promise.all([
    getGlobalWhatsOnForFilter(),
    tag ? resolveWhatsOnTagByText(tag) : Promise.resolve(null),
  ])

  const initialCategoryFilter =
    resolveInitialWhatsOnTagFilter(filterOptionCards, tag, resolvedTag) ?? GRID_CARD_FILTER_ALL

  const filterResult = await getGlobalWhatsOnForFilterPage(1, undefined, {
    category: initialCategoryFilter !== GRID_CARD_FILTER_ALL ? initialCategoryFilter : undefined,
    branch: branchSlug,
  })

  return (
    <main id="main" className="whats-on-filter-page">
      <section data-section="filter" className="bg-beige header-padding">
        <div className="sc-inner pc-t-150 pc-b-100 mb-t-100 mb-b-50">
          <GridCardContainer
            cardVariant="whats-on"
            syncFiltersToUrl={{ categoryParam: 'tag', branchParam: 'branch' }}
            cardContext={{
              branchSlug: branch?.slug ?? '',
              themeColor:
                branch?.bgColor && branch?.primaryColor
                  ? { bgColor: branch.bgColor, color: branch.primaryColor }
                  : undefined,
              backgroundColor: 'var(--color-beige)',
            }}
            backLink={{ href: branch ? `/${branch.slug}/whats-on` : '/whats-on' }}
            title="Search Results"
            showCount
            showCategoryFilter
            showBranchFilter
            initialCategoryFilter={initialCategoryFilter}
            cards={filterResult.cards}
            filterOptionCards={filterOptionCards}
            hasMore={filterResult.hasMore}
            loadMoreUrl="/api/cards/whats-on-filter"
            emptyMessage="No events found."
          />
        </div>
      </section>
    </main>
  )
}
