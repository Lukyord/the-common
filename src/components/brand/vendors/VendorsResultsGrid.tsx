'use client'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, type ReactNode } from 'react'

import VendorCard from '@/components/branch/components/vendor-card/VendorCard'
import VendorCardMultipleBranch from '@/components/branch/components/vendor-card/VendorCardMultipleBranch'
import type { BranchVendorCard, MultiBranchVendorInfo } from '@/components/branch/vendors/types'
import { toBrandVendorDetailHref } from '@/lib/vendorDetailLink'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

type VendorsResultsGridProps = {
  branchSlug: string
  cards: BranchVendorCard[]
  hasMore: boolean
  isLoading: boolean
  isFilterLoading?: boolean
  multiBranchVendorsByName?: Record<string, MultiBranchVendorInfo>
  seeMoreLabel?: string
  vendorLinkFormat?: 'branch' | 'brand'
  onLoadMore: () => void
}

export default function VendorsResultsGrid({
  branchSlug,
  cards,
  hasMore,
  isLoading,
  isFilterLoading = false,
  multiBranchVendorsByName = {},
  seeMoreLabel = 'SEE MORE',
  vendorLinkFormat = 'branch',
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
            const vendorLink =
              vendorLinkFormat === 'brand' ? toBrandVendorDetailHref(vendor.link) : vendor.link

            if (multiBranch) {
              const branches =
                vendorLinkFormat === 'brand'
                  ? multiBranch.branches.map((branch) => ({
                      ...branch,
                      link: toBrandVendorDetailHref(branch.link),
                    }))
                  : multiBranch.branches

              return (
                <VendorCardMultipleBranch
                  key={vendor.id}
                  branchSlug={branchSlug}
                  branches={branches}
                  media={multiBranch.media}
                  title={vendor.title}
                  tags={vendor.tags}
                />
              )
            }

            return (
              <VendorCard key={vendor.id} branchSlug={branchSlug} {...vendor} link={vendorLink} />
            )
          })}
        </div>
      ) : (
        <div
          className={`vendors-empty ${isFilterLoading ? ' is-filter-loading' : ''}`}
          aria-busy={isFilterLoading}
        >
          <h3 className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium">
            No matches this time.
          </h3>
          <p className="type-d-body-s type-m-body-s letter-spacing-002">
            No worries! Why not explore All vendors?
            <br className="show-md" />
            You never know—you might find a new favorite.
          </p>
        </div>
      )}

      {hasMore ? (
        <AnimateOnScroll triggerClass="fadeIn" className="vendors-see-more">
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
        </AnimateOnScroll>
      ) : null}
    </>
  )
}
