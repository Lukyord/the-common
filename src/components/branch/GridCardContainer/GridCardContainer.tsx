'use client'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useMemo, useState } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import AnimatedDropdown from '@/components/common/AnimatedDropdown'
import BackLink from '@/components/common/BackLink'

import {
  buildBranchFilterOptions,
  buildCategoryFilterOptions,
  filterGridCardsByBranch,
  filterGridCardsByCategory,
  GRID_CARD_FILTER_ALL,
  type GridCard,
} from './filterGridCards'
import { renderGridCard } from './renderGridCard'
import { GRID_CARD_SORT_OPTIONS, sortGridCards } from './sortGridCards'
import type { GridCardContainerProps, GridCardLoadMoreResult, GridCardSortOrder } from './types'

const GRID_CARD_DROPDOWN_CLASS =
  'grid-card-dropdown type-d-body-m type-m-body-m weight-medium letter-spacing-002'

export default function GridCardContainer({
  backLink,
  title,
  showCount = false,
  showSort = false,
  showBranchFilter = false,
  showCategoryFilter = false,
  filterSlot,
  cards: initialCards,
  hasMore: initialHasMore = false,
  loadMoreUrl,
  loadMoreParams,
  cardVariant,
  cardContext,
  seeMoreLabel = 'SEE MORE',
  emptyMessage = 'No items found.',
  cardLayout = 'grid',
}: GridCardContainerProps) {
  const [cards, setCards] = useState(initialCards)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<GridCardSortOrder>('newest-oldest')
  const [branchFilter, setBranchFilter] = useState(GRID_CARD_FILTER_ALL)
  const [categoryFilter, setCategoryFilter] = useState(GRID_CARD_FILTER_ALL)

  const branchFilterOptions = useMemo(
    () => (showBranchFilter ? buildBranchFilterOptions(cards as GridCard[]) : []),
    [cards, showBranchFilter],
  )

  const categoryFilterOptions = useMemo(
    () => (showCategoryFilter ? buildCategoryFilterOptions(cards as GridCard[], cardVariant) : []),
    [cards, cardVariant, showCategoryFilter],
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
  }, [hasMore, isLoading, loadMoreParams, loadMoreUrl, page])

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
            {showBranchFilter ? (
              <div className="grid-card-filter">
                <AnimatedDropdown
                  className={GRID_CARD_DROPDOWN_CLASS}
                  ariaLabel="Filter by branch"
                  options={branchFilterOptions}
                  value={branchFilter}
                  onChange={setBranchFilter}
                />
              </div>
            ) : null}
            {showCategoryFilter ? (
              <div className="grid-card-filter">
                <AnimatedDropdown
                  className={GRID_CARD_DROPDOWN_CLASS}
                  ariaLabel="Filter by category"
                  options={categoryFilterOptions}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
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
                  onChange={(value) => setSortOrder(value as GridCardSortOrder)}
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
              {renderGridCard(card, cardVariant, cardContext)}
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
