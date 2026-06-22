'use client'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

import VendorCard from '@/components/branch/components/vendor-card/VendorCard'
import VendorCardMultipleBranch from '@/components/branch/components/vendor-card/VendorCardMultipleBranch'
import type { BranchVendorCard, MultiBranchVendorInfo } from '@/components/branch/vendors/types'
import { MarkdownContent } from '@/components/common/markdown-content'

type VendorsResultsGridProps = {
  branchSlug: string
  cards: BranchVendorCard[]
  hasMore: boolean
  isLoading: boolean
  isFilterLoading?: boolean
  multiBranchVendorsByName?: Record<string, MultiBranchVendorInfo>
  emptyMessage?: string
  seeMoreLabel?: string
  onLoadMore: () => void
}

export default function VendorsResultsGrid({
  branchSlug,
  cards,
  hasMore,
  isLoading,
  isFilterLoading = false,
  multiBranchVendorsByName = {},
  emptyMessage = "We're having trouble tracking down spots you're looking for.<br>Please try searching again.",
  seeMoreLabel = 'SEE MORE',
  onLoadMore,
}: VendorsResultsGridProps) {
  const previousCardCountRef = useRef(cards.length)

  useEffect(() => {
    if (cards.length === previousCardCountRef.current) return

    previousCardCountRef.current = cards.length

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => cancelAnimationFrame(frame)
  }, [cards.length])

  const showEmptyState = cards.length === 0

  return (
    <>
      {cards.length > 0 ? (
        <div
          className={`card-container${isFilterLoading ? ' is-filter-loading' : ''}`}
          data-card-layout="grid"
          aria-busy={isFilterLoading}
        >
          {cards.map((vendor) => {
            const multiBranch = multiBranchVendorsByName[vendor.title]

            if (multiBranch) {
              return (
                <VendorCardMultipleBranch
                  key={vendor.id}
                  branchSlug={branchSlug}
                  branches={multiBranch.branches}
                  media={multiBranch.media}
                  title={vendor.title}
                  tags={vendor.tags}
                />
              )
            }

            return <VendorCard key={vendor.id} branchSlug={branchSlug} {...vendor} />
          })}
        </div>
      ) : (
        <MarkdownContent
          as="p"
          className={`vendors-empty type-d-title type-m-body-s letter-spacing-002 weight-medium${isFilterLoading ? ' is-filter-loading' : ''}`}
          aria-busy={isFilterLoading}
        >
          {emptyMessage}
        </MarkdownContent>
      )}

      {hasMore ? (
        <div className="vendors-see-more">
          <button
            type="button"
            className="see-more-button type-d-body-l type-m-title weight-medium letter-spacing-002"
            onClick={onLoadMore}
            disabled={isLoading || isFilterLoading}
            aria-busy={isLoading || isFilterLoading}
          >
            <span>
              <span>{isLoading || isFilterLoading ? 'LOADING...' : seeMoreLabel}</span>
            </span>
          </button>
        </div>
      ) : null}
    </>
  )
}
