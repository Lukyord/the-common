'use client'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useMemo, useState } from 'react'

import BlogCard from '@/components/branch/components/blog-card/BlogCard'
import type { GridCardSortOrder } from '@/components/branch/GridCardContainer/types'
import { GRID_CARD_SORT_OPTIONS } from '@/components/branch/GridCardContainer/sortGridCards'
import type { BlogCardData } from '@/components/branch/blogs/types'
import AnimatedDropdown from '@/components/common/AnimatedDropdown'

import { sortBlogCards } from './sortBlogCards'

const GRID_CARD_DROPDOWN_CLASS =
  'grid-card-dropdown type-d-body-m type-m-body-m weight-medium letter-spacing-002'

type BlogsLoadMoreResult = {
  cards: BlogCardData[]
  hasMore: boolean
}

type BlogsListSectionProps = {
  cards: BlogCardData[]
  hasMore: boolean
  loadMoreUrl: string
  emptyMessage?: string
  seeMoreLabel?: string
}

export default function BlogsListSection({
  cards: initialCards,
  hasMore: initialHasMore,
  loadMoreUrl,
  emptyMessage = 'No blogs found.',
  seeMoreLabel = 'SEE MORE',
}: BlogsListSectionProps) {
  const [cards, setCards] = useState(initialCards)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<GridCardSortOrder>('newest-oldest')

  useEffect(() => {
    setCards(initialCards)
    setHasMore(initialHasMore)
    setPage(1)
  }, [initialCards, initialHasMore])

  const displayCards = useMemo(() => sortBlogCards(cards, sortOrder), [cards, sortOrder])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => cancelAnimationFrame(frame)
  }, [sortOrder, displayCards.length])

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    try {
      const params = new URLSearchParams({
        page: String(page + 1),
      })

      const response = await fetch(`${loadMoreUrl}?${params.toString()}`)
      if (!response.ok) return

      const data = (await response.json()) as BlogsLoadMoreResult

      setCards((current) => {
        const seen = new Set(current.map((card) => card.id))
        const nextCards = data.cards.filter((card) => !seen.has(card.id))

        return [...current, ...nextCards]
      })
      setHasMore(data.hasMore)
      setPage((current) => current + 1)
    } finally {
      setIsLoading(false)
    }
  }, [hasMore, isLoading, loadMoreUrl, page])

  return (
    <div className="container grid-card-contianer">
      <div className="sc-header">
        <div className="sc-ttl" aria-hidden="true" />

        <div className="sc-filter-sortby">
          <div className="grid-card-sort">
            <AnimatedDropdown
              className={GRID_CARD_DROPDOWN_CLASS}
              ariaLabel="Sort by"
              options={[...GRID_CARD_SORT_OPTIONS]}
              value={sortOrder}
              onChange={(value) => setSortOrder(value as GridCardSortOrder)}
            />
          </div>
        </div>
      </div>

      {displayCards.length > 0 ? (
        <div className="card-container" data-card-layout="grid">
          {displayCards.map((blog, index) => (
            <div key={`${blog.id}-${sortOrder}`} style={{ order: index }}>
              <BlogCard {...blog} />
            </div>
          ))}
        </div>
      ) : (
        <p className="grid-card-empty type-d-body-m type-m-body-s letter-spacing-002">
          {emptyMessage}
        </p>
      )}

      {hasMore ? (
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
