'use client'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import AnimatedDropdown from '@/components/common/AnimatedDropdown'
import BackLink from '@/components/common/BackLink'

import {
  buildBranchFilterOptions,
  buildCategoryFilterOptions,
  filterGridCardsByBranch,
  filterGridCardsByCategory,
  GRID_CARD_FILTER_ALL,
  resolveFilterValueFromUrl,
  type GridCard,
} from './filterGridCards'
import { renderGridCard } from './renderGridCard'
import { GRID_CARD_SORT_OPTIONS, sortGridCards } from './sortGridCards'
import type { GridCardContainerProps, GridCardLoadMoreResult, GridCardSortOrder } from './types'

const GRID_CARD_DROPDOWN_CLASS =
  'grid-card-dropdown type-d-body-m type-m-body-m weight-medium letter-spacing-002'

type GridCardContainerContentProps = GridCardContainerProps & {
  onUpdateSearchParams?: (updates: Record<string, string | null>) => void
  urlSearchParams?: URLSearchParams
}

function GridCardContainerContent({
  backLink,
  title,
  showCount = false,
  showSort = false,
  showBranchFilter = false,
  showCategoryFilter = false,
  initialCategoryFilter,
  syncFiltersToUrl,
  filterSlot,
  cards: initialCards,
  filterOptionCards,
  hasMore: initialHasMore = false,
  loadMoreUrl,
  loadMoreParams,
  cardVariant,
  cardContext,
  seeMoreLabel = 'SEE MORE',
  emptyMessage = 'No items found.',
  cardLayout = 'grid',
  multiBranchVendorsByName,
  onUpdateSearchParams,
  urlSearchParams,
}: GridCardContainerContentProps) {
  const [cards, setCards] = useState(initialCards)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [localSortOrder, setLocalSortOrder] = useState<GridCardSortOrder>('newest-oldest')
  const [localBranchFilter, setLocalBranchFilter] = useState(GRID_CARD_FILTER_ALL)
  const [localCategoryFilter, setLocalCategoryFilter] = useState(
    initialCategoryFilter ?? GRID_CARD_FILTER_ALL,
  )

  const usesUrlFilters = Boolean(syncFiltersToUrl && urlSearchParams && onUpdateSearchParams)
  const cardsForFilterOptions = (filterOptionCards ?? cards) as GridCard[]

  useEffect(() => {
    setCards(initialCards)
    setHasMore(initialHasMore)
    setPage(1)
  }, [initialCards, initialHasMore])

  useEffect(() => {
    if (usesUrlFilters) return
    setLocalCategoryFilter(initialCategoryFilter ?? GRID_CARD_FILTER_ALL)
  }, [initialCategoryFilter, usesUrlFilters])

  const branchFilterOptions = useMemo(() => {
    if (!showBranchFilter) return []

    const options = buildBranchFilterOptions(cardsForFilterOptions)
    const urlBranch =
      usesUrlFilters && syncFiltersToUrl?.branchParam
        ? urlSearchParams?.get(syncFiltersToUrl.branchParam)
        : null

    if (
      urlBranch &&
      urlBranch !== GRID_CARD_FILTER_ALL &&
      !options.some((option) => option.value.toLowerCase() === urlBranch.toLowerCase())
    ) {
      return [...options, { value: urlBranch, label: urlBranch }]
    }

    return options
  }, [cardsForFilterOptions, showBranchFilter, syncFiltersToUrl, urlSearchParams, usesUrlFilters])

  const categoryFilterOptions = useMemo(() => {
    if (!showCategoryFilter) return []

    const options = buildCategoryFilterOptions(cardsForFilterOptions, cardVariant)
    const urlCategory =
      usesUrlFilters && syncFiltersToUrl
        ? urlSearchParams.get(syncFiltersToUrl.categoryParam)
        : initialCategoryFilter

    if (
      urlCategory &&
      urlCategory !== GRID_CARD_FILTER_ALL &&
      !options.some((option) => option.value.toLowerCase() === urlCategory.toLowerCase())
    ) {
      return [...options, { value: urlCategory, label: urlCategory }]
    }

    return options
  }, [
    cardVariant,
    cardsForFilterOptions,
    initialCategoryFilter,
    showCategoryFilter,
    syncFiltersToUrl,
    urlSearchParams,
    usesUrlFilters,
  ])

  const categoryFilter = useMemo(() => {
    if (!showCategoryFilter) return GRID_CARD_FILTER_ALL

    if (usesUrlFilters && syncFiltersToUrl) {
      return resolveFilterValueFromUrl(
        urlSearchParams!.get(syncFiltersToUrl.categoryParam),
        categoryFilterOptions,
      )
    }

    return resolveFilterValueFromUrl(localCategoryFilter, categoryFilterOptions)
  }, [
    categoryFilterOptions,
    localCategoryFilter,
    showCategoryFilter,
    syncFiltersToUrl,
    urlSearchParams,
    usesUrlFilters,
  ])

  const branchFilter = useMemo(() => {
    if (!showBranchFilter) return GRID_CARD_FILTER_ALL

    if (usesUrlFilters && syncFiltersToUrl?.branchParam) {
      return resolveFilterValueFromUrl(
        urlSearchParams!.get(syncFiltersToUrl.branchParam),
        branchFilterOptions,
      )
    }

    return localBranchFilter
  }, [
    branchFilterOptions,
    localBranchFilter,
    showBranchFilter,
    syncFiltersToUrl,
    urlSearchParams,
    usesUrlFilters,
  ])

  const sortOrder = useMemo((): GridCardSortOrder => {
    if (!showSort) return 'newest-oldest'

    if (usesUrlFilters && syncFiltersToUrl?.sortParam) {
      const value = urlSearchParams!.get(syncFiltersToUrl.sortParam)
      if (value === 'oldest-newest' || value === 'newest-oldest') return value
      return 'newest-oldest'
    }

    return localSortOrder
  }, [localSortOrder, showSort, syncFiltersToUrl, urlSearchParams, usesUrlFilters])

  const handleCategoryChange = useCallback(
    (value: string) => {
      if (usesUrlFilters && syncFiltersToUrl && onUpdateSearchParams) {
        onUpdateSearchParams({ [syncFiltersToUrl.categoryParam]: value })
        return
      }

      setLocalCategoryFilter(value)
    },
    [onUpdateSearchParams, syncFiltersToUrl, usesUrlFilters],
  )

  const handleBranchChange = useCallback(
    (value: string) => {
      if (usesUrlFilters && syncFiltersToUrl?.branchParam && onUpdateSearchParams) {
        onUpdateSearchParams({ [syncFiltersToUrl.branchParam]: value })
        return
      }

      setLocalBranchFilter(value)
    },
    [onUpdateSearchParams, syncFiltersToUrl, usesUrlFilters],
  )

  const handleSortChange = useCallback(
    (value: string) => {
      const nextSortOrder = value as GridCardSortOrder

      if (usesUrlFilters && syncFiltersToUrl?.sortParam && onUpdateSearchParams) {
        onUpdateSearchParams({
          [syncFiltersToUrl.sortParam]:
            nextSortOrder === 'newest-oldest' ? null : nextSortOrder,
        })
        return
      }

      setLocalSortOrder(nextSortOrder)
    },
    [onUpdateSearchParams, syncFiltersToUrl, usesUrlFilters],
  )

  const filteredCards = useMemo((): typeof cards => {
    let nextCards: GridCard[] = cards as GridCard[]

    if (showBranchFilter) {
      nextCards = filterGridCardsByBranch(nextCards, branchFilter)
    }

    if (showCategoryFilter) {
      nextCards = filterGridCardsByCategory(nextCards, categoryFilter, cardVariant)
    }

    return nextCards as typeof cards
  }, [branchFilter, cards, cardVariant, categoryFilter, showBranchFilter, showCategoryFilter])

  const displayCards = useMemo(
    () =>
      showSort
        ? (sortGridCards(filteredCards, cardVariant, sortOrder) as typeof cards)
        : filteredCards,
    [cardVariant, filteredCards, showSort, sortOrder],
  )

  const scrollLayoutKey = `${sortOrder}-${branchFilter}-${categoryFilter}`

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => cancelAnimationFrame(frame)
  }, [scrollLayoutKey, displayCards.length])

  const showFilters = showSort || showBranchFilter || showCategoryFilter || filterSlot

  const handleLoadMore = useCallback(async () => {
    if (!loadMoreUrl || isLoading || !hasMore) return

    setIsLoading(true)

    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        ...loadMoreParams,
      })

      if (usesUrlFilters && syncFiltersToUrl) {
        if (
          showBranchFilter &&
          syncFiltersToUrl.branchParam &&
          branchFilter !== GRID_CARD_FILTER_ALL
        ) {
          params.set(syncFiltersToUrl.branchParam, branchFilter)
        }

        if (showCategoryFilter && categoryFilter !== GRID_CARD_FILTER_ALL) {
          params.set(syncFiltersToUrl.categoryParam, categoryFilter)
        }
      }

      const response = await fetch(`${loadMoreUrl}?${params.toString()}`)

      if (!response.ok) return

      const data = (await response.json()) as GridCardLoadMoreResult<(typeof initialCards)[number]>
      setCards((current) => {
        const seen = new Set(current.map((card) => card.id))
        const nextCards = data.cards.filter((card) => !seen.has(card.id))

        return [...current, ...nextCards] as typeof current
      })
      setHasMore(data.hasMore)
      setPage((current) => current + 1)
    } finally {
      setIsLoading(false)
    }
  }, [
    branchFilter,
    categoryFilter,
    hasMore,
    isLoading,
    loadMoreParams,
    loadMoreUrl,
    page,
    showBranchFilter,
    showCategoryFilter,
    syncFiltersToUrl,
    usesUrlFilters,
  ])

  return (
    <div className="container grid-card-contianer">
      {backLink && (
        <AnimateOnScroll triggerClass="fadeIn">
          <BackLink fallbackHref={backLink.href} className="back">
            <i className="ic ic-arrow-left size-icon-2xs"></i>
            <p className="letter-spacing-002 weight-medium">{backLink.label ?? 'BACK'}</p>
          </BackLink>
        </AnimateOnScroll>
      )}

      <div className="sc-header">
        <div className="sc-ttl">
          <h2 className="type-d-header type-m-display letter-spacing-002 weight-medium uppercase">
            {title}
            {showCount ? ` (${displayCards.length})` : null}
          </h2>
        </div>

        {showFilters ? (
          <div className="sc-filter-sortby">
            {showCategoryFilter ? (
              <div className="grid-card-filter">
                <AnimatedDropdown
                  className={GRID_CARD_DROPDOWN_CLASS}
                  ariaLabel="Filter by category"
                  options={categoryFilterOptions}
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                />
              </div>
            ) : null}
            {showBranchFilter ? (
              <div className="grid-card-filter">
                <AnimatedDropdown
                  className={GRID_CARD_DROPDOWN_CLASS}
                  ariaLabel="Filter by branch"
                  options={branchFilterOptions}
                  value={branchFilter}
                  onChange={handleBranchChange}
                />
              </div>
            ) : null}
            {showSort ? (
              <div className="grid-card-sort">
                <AnimatedDropdown
                  className={GRID_CARD_DROPDOWN_CLASS}
                  ariaLabel="Sort by"
                  options={[...GRID_CARD_SORT_OPTIONS]}
                  value={sortOrder}
                  onChange={handleSortChange}
                />
              </div>
            ) : null}
            {filterSlot}
          </div>
        ) : null}
      </div>

      {displayCards.length > 0 ? (
        <div className="card-container" data-card-layout={cardLayout}>
          {displayCards.map((card, index) => (
            <div key={`${card.id}-${scrollLayoutKey}`} style={{ order: index }}>
              {renderGridCard(card, cardVariant, cardContext, multiBranchVendorsByName)}
            </div>
          ))}
        </div>
      ) : (
        <p className="grid-card-empty type-d-body-m type-m-body-s letter-spacing-002">
          {emptyMessage}
        </p>
      )}

      {loadMoreUrl && hasMore ? (
        <div className="grid-card-see-more">
          <button
            type="button"
            className="see-more-button type-d-body-l type-m-title weight-medium letter-spacing-002"
            onClick={handleLoadMore}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            <span>
              <span>{isLoading ? 'LOADING...' : seeMoreLabel}</span>
            </span>
          </button>
        </div>
      ) : null}
    </div>
  )
}

function GridCardContainerUrlBridge(props: GridCardContainerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onUpdateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === GRID_CARD_FILTER_ALL) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return (
    <GridCardContainerContent
      {...props}
      urlSearchParams={new URLSearchParams(searchParams.toString())}
      onUpdateSearchParams={onUpdateSearchParams}
    />
  )
}

export default function GridCardContainer(props: GridCardContainerProps) {
  if (props.syncFiltersToUrl) {
    return (
      <Suspense
        fallback={
          <GridCardContainerContent
            {...props}
            initialCategoryFilter={
              props.initialCategoryFilter ?? GRID_CARD_FILTER_ALL
            }
          />
        }
      >
        <GridCardContainerUrlBridge {...props} />
      </Suspense>
    )
  }

  return <GridCardContainerContent {...props} />
}
