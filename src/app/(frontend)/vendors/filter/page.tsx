import { GridCardContainer, GRID_CARD_FILTER_ALL } from '@/components/branch/GridCardContainer'
import { generateMeta } from '@/lib/generateMeta'
import {
  dedupeMultiBranchVendorCards,
  getBranchBySlug,
  getGlobalVendorsForFilter,
  getGlobalVendorsForFilterPage,
  getMultiBranchVendorLookup,
  resolveInitialVendorCategoryFilter,
  resolveVendorCategoryByText,
} from '@/payload/queries/branch'
import type { Metadata } from 'next'
import React from 'react'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ branch?: string | string[]; category?: string | string[] }>
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
  const category = getSearchParam(params.category)
  const resolvedCategory = category ? await resolveVendorCategoryByText(category) : null
  const categoryLabel = resolvedCategory?.text ?? category

  if (!branchSlug) {
    return generateMeta({
      fallbackTitle: categoryLabel ? `${categoryLabel} | The Common` : 'Vendors | The Common',
      fallbackDescription: categoryLabel
        ? `${categoryLabel} vendors at The Common`
        : 'Vendors at The Common',
    })
  }

  const branch = await getBranchBySlug(branchSlug)

  return generateMeta({
    fallbackTitle: categoryLabel ? `${categoryLabel} | ${branch.name}` : `Vendors | ${branch.name}`,
    fallbackDescription: categoryLabel
      ? `${categoryLabel} vendors at ${branch.name}`
      : `Vendors at ${branch.name}`,
  })
}

export default async function VendorFilterPage({ searchParams }: Props) {
  const params = await searchParams
  const branchSlug = getSearchParam(params.branch)
  const category = getSearchParam(params.category)

  const branch = branchSlug ? await getBranchBySlug(branchSlug) : null
  const [rawCards, resolvedCategory, multiBranchVendorsByName] = await Promise.all([
    getGlobalVendorsForFilter(),
    category ? resolveVendorCategoryByText(category) : Promise.resolve(null),
    getMultiBranchVendorLookup(),
  ])

  const filterOptionCards = dedupeMultiBranchVendorCards(rawCards, multiBranchVendorsByName)
  const initialCategoryFilter =
    resolveInitialVendorCategoryFilter(filterOptionCards, category, resolvedCategory) ??
    GRID_CARD_FILTER_ALL

  const filterResult = await getGlobalVendorsForFilterPage(1, undefined, {
    category: initialCategoryFilter !== GRID_CARD_FILTER_ALL ? initialCategoryFilter : undefined,
    branch: branchSlug,
  })

  return (
    <main id="main" className="vendors-filter-page">
      <section data-section="filter" className="bg-beige header-padding">
        <div className="sc-inner pc-t-150 pc-b-100 mb-t-100 mb-b-50">
          <GridCardContainer
            cardVariant="vendor"
            syncFiltersToUrl={{ categoryParam: 'category', branchParam: 'branch' }}
            cardContext={{
              branchSlug: branch?.slug ?? '',
              themeColor:
                branch?.bgColor && branch?.primaryColor
                  ? { bgColor: branch.bgColor, color: branch.primaryColor }
                  : undefined,
              backgroundColor: 'var(--color-beige)',
            }}
            backLink={branch ? { href: `/${branch.slug}/vendors` } : undefined}
            title="Search Results"
            showCount
            showCategoryFilter
            showBranchFilter
            initialCategoryFilter={initialCategoryFilter}
            multiBranchVendorsByName={multiBranchVendorsByName}
            cards={filterResult.cards}
            filterOptionCards={filterOptionCards}
            hasMore={filterResult.hasMore}
            loadMoreUrl="/api/cards/vendors-filter"
            emptyMessage="No vendors found."
          />
        </div>
      </section>
    </main>
  )
}
