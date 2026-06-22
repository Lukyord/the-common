'use client'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import VendorCard from '@/components/branch/components/vendor-card/VendorCard'
import VendorCardMultipleBranch from '@/components/branch/components/vendor-card/VendorCardMultipleBranch'
import MoodFilterTag from '@/components/branch/vendors/MoodFiltertag'
import { branchHeaderThemeStyle } from '@/lib/branchTheme'
import type {
  BranchVendorCard,
  LifestyleOption,
  MultiBranchVendorInfo,
} from '@/components/branch/vendors/types'

const MOOD_FILTER_ALL = 'all' as const

type MoodFilter = typeof MOOD_FILTER_ALL | number[]

type VendorLoadMoreResult = {
  cards: BranchVendorCard[]
  hasMore: boolean
}

type VendorsListSectionProps = {
  sectionClassName?: string
  scInnerClassName?: string
  branchSlug: string
  branchTheme?: {
    bgColor?: string | null
    primaryColor?: string | null
  }
  lifestyles: LifestyleOption[]
  cards: BranchVendorCard[]
  hasMore: boolean
  multiBranchVendorsByName?: Record<string, MultiBranchVendorInfo>
  loadMoreUrl: string
  title?: string | null
  emptyMessage?: string
  seeMoreLabel?: string
}

function isLifestyleSelected(filter: MoodFilter, lifestyleId: number) {
  return filter !== MOOD_FILTER_ALL && filter.includes(lifestyleId)
}

function buildLifestylesParam(filter: MoodFilter) {
  if (filter === MOOD_FILTER_ALL) return undefined
  return filter.join(',')
}

function sortLifestylesForWrap(lifestyles: LifestyleOption[]) {
  return [...lifestyles].sort((a, b) => {
    const lengthDiff = a.text.length - b.text.length
    if (lengthDiff !== 0) return lengthDiff
    return a.text.localeCompare(b.text)
  })
}

export default function VendorsListSection({
  sectionClassName,
  scInnerClassName,
  branchSlug,
  branchTheme,
  lifestyles,
  cards: initialCards,
  hasMore: initialHasMore,
  multiBranchVendorsByName = {},
  loadMoreUrl,
  title = "I'M LOOKING FOR...",
  emptyMessage = 'No vendors found.',
  seeMoreLabel = 'SEE MORE',
}: VendorsListSectionProps) {
  const [moodFilter, setMoodFilter] = useState<MoodFilter>(MOOD_FILTER_ALL)
  const [cards, setCards] = useState(initialCards)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isFirstFilterRender = useRef(true)

  const themeStyle = branchHeaderThemeStyle(branchTheme)

  const displayLifestyles = useMemo(
    () => (isMobile ? sortLifestylesForWrap(lifestyles) : lifestyles),
    [isMobile, lifestyles],
  )

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => cancelAnimationFrame(frame)
  }, [cards.length])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 991px)')
    const update = () => setIsMobile(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  const fetchVendors = useCallback(
    async (nextPage: number, filter: MoodFilter, append: boolean) => {
      setIsLoading(true)

      try {
        const params = new URLSearchParams({
          branch: branchSlug,
          page: String(nextPage),
        })

        const lifestylesParam = buildLifestylesParam(filter)
        if (lifestylesParam) {
          params.set('lifestyles', lifestylesParam)
        }

        const response = await fetch(`${loadMoreUrl}?${params.toString()}`)
        if (!response.ok) return

        const data = (await response.json()) as VendorLoadMoreResult

        setCards((current) => {
          if (!append) return data.cards

          const seen = new Set(current.map((card) => card.id))
          const nextCards = data.cards.filter((card) => !seen.has(card.id))

          return [...current, ...nextCards]
        })
        setHasMore(data.hasMore)
        setPage(nextPage)
      } finally {
        setIsLoading(false)
      }
    },
    [branchSlug, loadMoreUrl],
  )

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false
      return
    }

    void fetchVendors(1, moodFilter, false)
  }, [moodFilter, fetchVendors])

  const selectAll = () => {
    setMoodFilter(MOOD_FILTER_ALL)
  }

  const toggleLifestyle = (lifestyleId: number) => {
    setMoodFilter((current) => {
      if (current === MOOD_FILTER_ALL) return [lifestyleId]

      if (current.includes(lifestyleId)) {
        const next = current.filter((id) => id !== lifestyleId)
        return next.length ? next : MOOD_FILTER_ALL
      }

      return [...current, lifestyleId]
    })
  }

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return
    void fetchVendors(page + 1, moodFilter, true)
  }

  return (
    <section data-section="vendors-list" className={sectionClassName}>
      <div className={`sc-inner ${scInnerClassName}`}>
        <div className="container">
          <div className="sc-header">
            <div className="sc-ttl">
              <h2 className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium">
                {title}
              </h2>
            </div>

            <div className="tags-filter" style={themeStyle as CSSProperties}>
              <MoodFilterTag
                label="ALL"
                isActive={moodFilter === MOOD_FILTER_ALL}
                onClick={selectAll}
                showClose={false}
              />

              {displayLifestyles.map(({ id, text }) => (
                <MoodFilterTag
                  key={id}
                  label={text}
                  isActive={isLifestyleSelected(moodFilter, id)}
                  onClick={() => toggleLifestyle(id)}
                />
              ))}
            </div>
          </div>

          {cards.length > 0 ? (
            <div className="card-container" data-card-layout="grid">
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
            <p className="vendors-empty type-d-body-m type-m-body-s letter-spacing-002">
              {emptyMessage}
            </p>
          )}

          {hasMore ? (
            <div className="vendors-see-more">
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
      </div>
    </section>
  )
}
