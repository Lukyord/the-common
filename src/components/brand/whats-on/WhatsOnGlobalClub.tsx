'use client'

import { useMemo, useRef, useState, type CSSProperties } from 'react'

import WhatsOnCard, {
  type WhatsOnCardProps,
} from '@/components/branch/components/whats-on-card/WhatsOnCard'
import MoodFilterTag from '@/components/branch/vendors/MoodFiltertag'
import {
  filterGridCardsByBranches,
  GRID_CARD_FILTER_ALL,
} from '@/components/branch/GridCardContainer/filterGridCards'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import type { BranchLandingWhatsOnCard } from '@/payload/queries/branch'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type BranchFilterOption = {
  slug: string
  name: string
}

type BranchFilter = typeof GRID_CARD_FILTER_ALL | string[]

function isBranchSelected(filter: BranchFilter, branchSlug: string) {
  return filter !== GRID_CARD_FILTER_ALL && filter.includes(branchSlug)
}

function getCardThemeColor(
  branches: BranchLandingWhatsOnCard['branches'],
): WhatsOnCardProps['themeColor'] | undefined {
  if (branches.length !== 1) return undefined

  const [branch] = branches
  if (!branch?.bgColor || !branch?.primaryColor) return undefined

  return {
    bgColor: branch.bgColor,
    color: branch.primaryColor,
  }
}

type WhatsOnGlobalClubProps = {
  title?: string | null
  cards: BranchLandingWhatsOnCard[]
  branches: BranchFilterOption[]
  filterTheme?: {
    activeBackground?: string | null
    activeColor?: string | null
  }
  emptyMessage?: string
}

export default function WhatsOnGlobalClub({
  title,
  cards = [],
  branches,
  filterTheme,
  emptyMessage = 'No club events found.',
}: WhatsOnGlobalClubProps) {
  const [branchFilter, setBranchFilter] = useState<BranchFilter>(GRID_CARD_FILTER_ALL)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const filteredCards = useMemo(
    () => filterGridCardsByBranches(cards, branchFilter),
    [branchFilter, cards],
  )

  const selectAll = () => {
    setBranchFilter(GRID_CARD_FILTER_ALL)
  }

  const toggleBranch = (branchSlug: string) => {
    setBranchFilter((current) => {
      if (current === GRID_CARD_FILTER_ALL) return [branchSlug]

      if (current.includes(branchSlug)) {
        const next = current.filter((slug) => slug !== branchSlug)
        return next.length ? next : GRID_CARD_FILTER_ALL
      }

      return [...current, branchSlug]
    })
  }

  if (!title && cards.length === 0) return null

  return (
    <section data-section="whats-on-global-club" className="bg-checked">
      <div className="sc-inner pc-t-100 pc-b-100 mb-t-75 mb-b-75">
        <div className="container">
          <div className="sc-header">
            {title && (
              <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
                <MarkdownContent
                  as="h2"
                  className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium"
                >
                  {title}
                </MarkdownContent>
              </AnimateOnScroll>
            )}

            {filteredCards.length > 0 && (
              <div className="sc-nav">
                <button
                  ref={prevRef}
                  type="button"
                  className="swiper-button-prev"
                  aria-label="Previous slide"
                />
                <button
                  ref={nextRef}
                  type="button"
                  className="swiper-button-next"
                  aria-label="Next slide"
                />
              </div>
            )}
          </div>

          {branches.length > 0 && (
            <div className="tags-filter">
              <MoodFilterTag
                label="ALL"
                isActive={branchFilter === GRID_CARD_FILTER_ALL}
                onClick={selectAll}
                showClose={false}
              />

              {branches.map(({ slug, name }) => (
                <MoodFilterTag
                  key={slug}
                  label={name}
                  isActive={isBranchSelected(branchFilter, slug)}
                  onClick={() => toggleBranch(slug)}
                />
              ))}
            </div>
          )}

          {filteredCards.length > 0 ? (
            <div className="card-container" data-card-layout="slider">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  if (typeof swiper.params.navigation === 'object' && swiper.params.navigation) {
                    swiper.params.navigation.prevEl = prevRef.current
                    swiper.params.navigation.nextEl = nextRef.current
                  }
                }}
                onInit={(swiper) => {
                  swiper.navigation.init()
                  swiper.navigation.update()
                }}
                speed={1000}
                pagination={{ clickable: true }}
                slidesPerView="auto"
              >
                {filteredCards.map((card) => (
                  <SwiperSlide key={card.id}>
                    <WhatsOnCard
                      branchSlug={card.branches[0]?.slug}
                      {...card}
                      themeColor={getCardThemeColor(card.branches)}
                      backgroundColor="var(--color-dark-brown)"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <p className="whats-on-global-club-empty type-d-body-m type-m-body-s letter-spacing-002">
              {emptyMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
