'use client'

import { useCallback, useMemo, useState } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import AnimatedDropdown from '@/components/common/AnimatedDropdown'
import BackLink from '@/components/common/BackLink'

import { renderGridCard } from './renderGridCard'
import { GRID_CARD_SORT_OPTIONS, sortGridCards } from './sortGridCards'
import type { GridCardContainerProps, GridCardLoadMoreResult, GridCardSortOrder } from './types'

export default function GridCardContainer({
  backLink,
  title,
  showCount = false,
  showSort = false,
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

  const sortedCards = useMemo(
    () => (showSort ? (sortGridCards(cards, cardVariant, sortOrder) as typeof cards) : cards),
    [cards, cardVariant, showSort, sortOrder],
  )

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
            {showCount ? ` (${cards.length})` : null}
          </h2>
        </div>

        {showSort || filterSlot ? (
          <div className="sc-filter-sortby">
            {showSort ? (
              <div className="grid-card-sort">
                <AnimatedDropdown
                  className="grid-card-sort-dropdown type-d-body-m type-m-body-m weight-medium letter-spacing-002"
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

      {sortedCards.length > 0 ? (
        <div className="card-container" data-card-layout={cardLayout}>
          {sortedCards.map((card, index) => (
            <div key={card.id} style={{ order: index }}>
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
