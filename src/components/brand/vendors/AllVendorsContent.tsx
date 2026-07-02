'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'

import VendorsResultsGrid from '@/components/brand/vendors/VendorsResultsGrid'
import MoodFilterTag from '@/components/branch/vendors/MoodFiltertag'
import type {
  BranchVendorCard,
  LifestyleOption,
  MultiBranchVendorInfo,
} from '@/components/branch/vendors/types'
import { BRANCH_VENDORS_PAGE_SIZE } from '@/components/branch/vendors/types'
import { ALL_BRANCH_FILTER_SLUG, getBranchFilterShape } from '@/constants/branchFilterShapes'
import {
  animateResultsShellHeight,
  captureResultsShellHeight,
} from '@/lib/animateResultsShellHeight'
import Image from 'next/image'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

const MOOD_FILTER_ALL = 'all' as const
const TAG_LOAD_MORE_URL = '/api/cards/vendors'
const TAG_FILTER_LOAD_MORE_URL = '/api/cards/vendors-filter'
const SEARCH_LOAD_MORE_URL = '/api/cards/vendors-search'
const SEARCH_DEBOUNCE_MS = 300

type MoodFilter = typeof MOOD_FILTER_ALL | number[]

type BranchOption = {
  slug: string
  name: string
  bgColor?: string | null
  primaryColor?: string | null
}

type VendorLoadMoreResult = {
  cards: BranchVendorCard[]
  hasMore: boolean
}

type AllVendorsContentProps = {
  titleNode: ReactNode
  branches: BranchOption[]
  lifestyles: LifestyleOption[]
  initialBranchSlug: string
  initialTagCards: BranchVendorCard[]
  initialTagHasMore: boolean
  multiBranchVendorsByName: Record<string, MultiBranchVendorInfo>
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

export default function AllVendorsContent({
  titleNode,
  branches,
  lifestyles,
  initialBranchSlug,
  initialTagCards,
  initialTagHasMore,
  multiBranchVendorsByName,
}: AllVendorsContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [committedSearchQuery, setCommittedSearchQuery] = useState('')
  const [branchSlug, setBranchSlug] = useState(initialBranchSlug)
  const [committedBranchSlug, setCommittedBranchSlug] = useState(initialBranchSlug)
  const [moodFilter, setMoodFilter] = useState<MoodFilter>(MOOD_FILTER_ALL)
  const [committedMoodFilter, setCommittedMoodFilter] = useState<MoodFilter>(MOOD_FILTER_ALL)

  const [displayTagCards, setDisplayTagCards] = useState(initialTagCards)
  const [displayTagHasMore, setDisplayTagHasMore] = useState(initialTagHasMore)
  const [displayTagPage, setDisplayTagPage] = useState(1)
  const [isTagLoading, setIsTagLoading] = useState(false)

  const [searchCards, setSearchCards] = useState<BranchVendorCard[]>([])
  const [searchHasMore, setSearchHasMore] = useState(false)
  const [searchPage, setSearchPage] = useState(1)
  const [isSearchLoading, setIsSearchLoading] = useState(false)

  const [isMobile, setIsMobile] = useState(false)
  const [isTagFilterLoading, setIsTagFilterLoading] = useState(false)
  const [isSearchFilterLoading, setIsSearchFilterLoading] = useState(false)
  const isFirstTagFilterRender = useRef(true)
  const tagFetchIdRef = useRef(0)
  const searchFetchIdRef = useRef(0)
  const tagResultsShellRef = useRef<HTMLDivElement>(null)
  const searchResultsShellRef = useRef<HTMLDivElement>(null)
  const tagTransitionStartHeightRef = useRef<number | null>(null)
  const searchTransitionStartHeightRef = useRef<number | null>(null)

  const displayLifestyles = useMemo(
    () => (isMobile ? sortLifestylesForWrap(lifestyles) : lifestyles),
    [isMobile, lifestyles],
  )

  const branchFilterItems = useMemo(
    () => [{ slug: ALL_BRANCH_FILTER_SLUG, name: 'All Branches' }, ...branches],
    [branches],
  )

  const showSearchResults = committedSearchQuery.trim().length > 0

  useEffect(() => {
    if (searchQuery.trim()) return

    searchFetchIdRef.current += 1
    setDebouncedSearchQuery('')
    setCommittedSearchQuery('')
    setSearchCards([])
    setSearchHasMore(false)
    setSearchPage(1)
    setIsSearchFilterLoading(false)
    setIsSearchLoading(false)
  }, [searchQuery])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 991px)')
    const update = () => setIsMobile(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [searchQuery])

  const fetchTagVendors = useCallback(
    async (nextPage: number, filter: MoodFilter, nextBranchSlug: string, append: boolean) => {
      if (!nextBranchSlug) return

      const fetchId = ++tagFetchIdRef.current

      if (append) {
        setIsTagLoading(true)
      } else {
        setIsTagFilterLoading(true)
      }

      try {
        const response =
          nextBranchSlug === ALL_BRANCH_FILTER_SLUG
            ? await fetch(
                `${TAG_FILTER_LOAD_MORE_URL}?${new URLSearchParams({
                  page: String(nextPage),
                  limit: String(BRANCH_VENDORS_PAGE_SIZE),
                  ...(buildLifestylesParam(filter)
                    ? { lifestyles: buildLifestylesParam(filter)! }
                    : {}),
                }).toString()}`,
              )
            : await fetch(
                `${TAG_LOAD_MORE_URL}?${new URLSearchParams({
                  branch: nextBranchSlug,
                  page: String(nextPage),
                  ...(buildLifestylesParam(filter)
                    ? { lifestyles: buildLifestylesParam(filter)! }
                    : {}),
                }).toString()}`,
              )
        if (!response.ok || fetchId !== tagFetchIdRef.current) return

        const data = (await response.json()) as VendorLoadMoreResult
        if (fetchId !== tagFetchIdRef.current) return

        if (!append) {
          tagTransitionStartHeightRef.current = captureResultsShellHeight(
            tagResultsShellRef.current,
          )
        }

        setDisplayTagCards((current) => {
          if (!append) return data.cards

          const seen = new Set(current.map((card) => card.id))
          const nextCards = data.cards.filter((card) => !seen.has(card.id))

          return [...current, ...nextCards]
        })
        setDisplayTagHasMore(data.hasMore)
        setDisplayTagPage(nextPage)

        if (!append) {
          setCommittedMoodFilter(filter)
          setCommittedBranchSlug(nextBranchSlug)
        }
      } finally {
        if (fetchId !== tagFetchIdRef.current) return

        if (append) {
          setIsTagLoading(false)
        } else {
          setIsTagFilterLoading(false)
        }
      }
    },
    [],
  )

  const fetchSearchVendors = useCallback(
    async (nextPage: number, query: string, append: boolean, nextBranchSlug: string) => {
      const trimmed = query.trim()
      if (!trimmed) {
        setSearchCards([])
        setSearchHasMore(false)
        setSearchPage(1)
        setCommittedSearchQuery('')
        setIsSearchFilterLoading(false)
        return
      }

      const fetchId = ++searchFetchIdRef.current

      if (append) {
        setIsSearchLoading(true)
      } else {
        setIsSearchFilterLoading(true)
      }

      try {
        const params = new URLSearchParams({
          q: trimmed,
          page: String(nextPage),
          limit: String(BRANCH_VENDORS_PAGE_SIZE),
          branch: nextBranchSlug,
        })

        const response = await fetch(`${SEARCH_LOAD_MORE_URL}?${params.toString()}`)
        if (!response.ok || fetchId !== searchFetchIdRef.current) return

        const data = (await response.json()) as VendorLoadMoreResult
        if (fetchId !== searchFetchIdRef.current) return

        if (!append) {
          searchTransitionStartHeightRef.current = captureResultsShellHeight(
            searchResultsShellRef.current,
          )
        }

        setSearchCards((current) => {
          if (!append) return data.cards

          const seen = new Set(current.map((card) => card.id))
          const nextCards = data.cards.filter((card) => !seen.has(card.id))

          return [...current, ...nextCards]
        })
        setSearchHasMore(data.hasMore)
        setSearchPage(nextPage)

        if (!append) {
          setCommittedSearchQuery(trimmed)
        }
      } finally {
        if (fetchId !== searchFetchIdRef.current) return

        if (append) {
          setIsSearchLoading(false)
        } else {
          setIsSearchFilterLoading(false)
        }
      }
    },
    [],
  )

  useEffect(() => {
    if (isFirstTagFilterRender.current) {
      isFirstTagFilterRender.current = false
      return
    }

    void fetchTagVendors(1, moodFilter, branchSlug, false)
  }, [branchSlug, fetchTagVendors, moodFilter])

  useEffect(() => {
    void fetchSearchVendors(1, debouncedSearchQuery, false, branchSlug)
  }, [branchSlug, debouncedSearchQuery, fetchSearchVendors])

  useLayoutEffect(() => {
    const startHeight = tagTransitionStartHeightRef.current
    if (startHeight == null) return

    tagTransitionStartHeightRef.current = null
    animateResultsShellHeight(tagResultsShellRef.current, startHeight)
  }, [displayTagCards, displayTagHasMore])

  useLayoutEffect(() => {
    const startHeight = searchTransitionStartHeightRef.current
    if (startHeight == null) return

    searchTransitionStartHeightRef.current = null
    animateResultsShellHeight(searchResultsShellRef.current, startHeight)
  }, [searchCards, searchHasMore])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const selectAllLifestyles = () => {
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

  const handleTagLoadMore = () => {
    if (isTagLoading || isTagFilterLoading || !displayTagHasMore) return
    void fetchTagVendors(displayTagPage + 1, committedMoodFilter, committedBranchSlug, true)
  }

  const handleSearchLoadMore = () => {
    if (isSearchLoading || !searchHasMore) return
    void fetchSearchVendors(searchPage + 1, committedSearchQuery, true, branchSlug)
  }

  return (
    <>
      <div className="sc-header">
        <div className="search">
          {titleNode}

          <AnimateOnScroll delay={100} triggerClass="fadeIn">
            <form action="" onSubmit={handleSearchSubmit} className="search-form">
              <label htmlFor="all-vendors-search" className="visually-hidden">
                Search vendors
              </label>
              <input
                id="all-vendors-search"
                type="search"
                name="q"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Find your vendor soulmate"
                autoComplete="off"
                className="search-form__input type-d-title type-m-title weight-medium letter-spacing-002"
              />
              {searchQuery ? (
                <button
                  type="button"
                  className="search-form__action"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <i className="ic ic-close-bold" aria-hidden />
                </button>
              ) : (
                <span className="search-form__action" aria-hidden>
                  <i className="ic ic-search" />
                </span>
              )}
            </form>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay={200} triggerClass="fadeIn" className="branch-filter">
          {branchFilterItems.map((branch) => {
            const shapes = getBranchFilterShape(branch.slug)
            if (!shapes) return null

            const isActive = committedBranchSlug === branch.slug

            return (
              <button
                key={branch.slug}
                type="button"
                className={`branch-filter__item branch-filter__item--${branch.slug}${isActive ? ' is-active' : ''}`}
                onClick={() => setBranchSlug(branch.slug)}
                aria-pressed={isActive}
                aria-label={branch.name}
              >
                <span className="branch-filter__image">
                  <Image
                    src={shapes.default}
                    alt=""
                    fill
                    sizes="100vw"
                    className="branch-button-image"
                  />
                  <Image
                    src={shapes.active}
                    alt=""
                    fill
                    sizes="100vw"
                    className="branch-button-image active"
                  />
                </span>
              </button>
            )
          })}
        </AnimateOnScroll>
      </div>

      <div className="result">
        {!showSearchResults ? (
          <>
            <AnimateOnScroll
              triggerClass="fadeIn"
              delay={300}
              className="tags-filter-wrapper"
              data-section="vendors-list"
            >
              <div className="result-label">
                <p className="type-m-headliner-m letter-spacing-002 weight-medium">
                  I’M LOOKING FOR...
                </p>
              </div>
              <div className="tags-filter">
                <MoodFilterTag
                  label="ALL"
                  isActive={committedMoodFilter === MOOD_FILTER_ALL}
                  onClick={selectAllLifestyles}
                  showClose={false}
                />

                {displayLifestyles.map(({ id, text }) => (
                  <MoodFilterTag
                    key={id}
                    label={text}
                    isActive={isLifestyleSelected(committedMoodFilter, id)}
                    onClick={() => toggleLifestyle(id)}
                  />
                ))}
              </div>
            </AnimateOnScroll>

            <div
              ref={tagResultsShellRef}
              className="tags-result-wrapper vendors-results-shell"
              data-section="vendors-list"
            >
              <VendorsResultsGrid
                branchSlug={committedBranchSlug}
                cards={displayTagCards}
                hasMore={displayTagHasMore}
                isLoading={isTagLoading}
                isFilterLoading={isTagFilterLoading}
                multiBranchVendorsByName={multiBranchVendorsByName}
                vendorLinkFormat="brand"
                onLoadMore={handleTagLoadMore}
              />
            </div>
          </>
        ) : (
          <div
            ref={searchResultsShellRef}
            className="search-result-wrapper vendors-results-shell"
            data-section="vendors-list"
          >
            <div className="search-text">
              <p className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium">
                {committedSearchQuery} <span>({searchCards.length})</span>
              </p>
            </div>
            <VendorsResultsGrid
              branchSlug={branchSlug}
              cards={searchCards}
              hasMore={searchHasMore}
              isLoading={isSearchLoading}
              isFilterLoading={isSearchFilterLoading}
              multiBranchVendorsByName={multiBranchVendorsByName}
              vendorLinkFormat="brand"
              onLoadMore={handleSearchLoadMore}
            />
          </div>
        )}
      </div>
    </>
  )
}
