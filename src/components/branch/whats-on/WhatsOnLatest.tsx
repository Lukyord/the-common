'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

import WhatsOnCard from '@/components/branch/components/whats-on-card/WhatsOnCard'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import AnimatedDropdown from '@/components/common/AnimatedDropdown'
import { MarkdownContent } from '@/components/common/markdown-content'
import type { BranchLandingWhatsOnCard } from '@/payload/queries/branch'
import { getEarliestEventScheduleDate } from '@/lib/whatsOnEventSchedule'
import {
  buildWhatsOnTimeframeOptions,
  filterByTimeframe,
  type WhatsOnTimeframeId,
} from '@/lib/whatsOnTimeframe'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import Link from 'next/link'

type WhatsOnLatestProps = {
  title?: string | null
  branchSlug: string
  background?: string | null
  allBranchesBackground?: string | null
  allBranchesTextColor?: string | null
  themeColor?: {
    bgColor: string
    color: string
  }
  cards: BranchLandingWhatsOnCard[]
  emptyMessage?: string
}

const DEFAULT_TIMEFRAME: WhatsOnTimeframeId = 'this-week'

export default function WhatsOnLatest({
  title,
  branchSlug,
  background,
  allBranchesBackground,
  allBranchesTextColor,
  themeColor,
  cards = [],
  emptyMessage = 'Nothing scheduled for this period.',
}: WhatsOnLatestProps) {
  const timeframeOptions = useMemo(() => buildWhatsOnTimeframeOptions(), [])
  const [selectedTimeframe, setSelectedTimeframe] = useState<WhatsOnTimeframeId>(DEFAULT_TIMEFRAME)

  const selectedOption = timeframeOptions.find((option) => option.id === selectedTimeframe)
  const filteredCards = useMemo(() => {
    const filtered = filterByTimeframe(cards, selectedTimeframe)
    return [...filtered].sort((a, b) => {
      const aTime = getEarliestEventScheduleDate(a.eventSchedule)?.getTime() ?? 0
      const bTime = getEarliestEventScheduleDate(b.eventSchedule)?.getTime() ?? 0
      return aTime - bTime
    })
  }, [cards, selectedTimeframe])

  if (!title && cards.length === 0) return null

  return (
    <section
      data-section="card-section"
      className="whats-on-latest dark-bg"
      style={
        {
          '--bg-color': background ?? undefined,
        } as CSSProperties
      }
    >
      <div className="sc-inner pc-t-100 pc-b-100 mb-t-75 mb-b-75">
        <div className="container">
          <div className="sc-header type-d-header type-m-headliner-m letter-spacing-002 weight-medium uppercase">
            <AnimateOnScroll triggerClass="fadeIn" className="left">
              {title && (
                <div className="sc-ttl">
                  <MarkdownContent as="h2" inline>
                    {title}
                  </MarkdownContent>
                </div>
              )}
              <div className="time-selector">
                <AnimatedDropdown
                  className="time-frame-dropdown"
                  ariaLabel="Select timeframe"
                  options={timeframeOptions.map((option) => ({
                    value: option.id,
                    label: option.label.toUpperCase(),
                  }))}
                  value={selectedTimeframe}
                  onChange={(value) => setSelectedTimeframe(value as WhatsOnTimeframeId)}
                />
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll triggerClass="fadeIn" className="right show-md">
              <div className="sc-time">
                <p>{selectedOption?.displayLabel}</p>
              </div>
            </AnimateOnScroll>
          </div>

          {filteredCards.length > 0 ? (
            <div className="card-container" data-card-layout="slider">
              <Swiper
                autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
                }}
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                slidesPerView="auto"
              >
                {filteredCards.map((card) => (
                  <SwiperSlide key={card.id}>
                    <WhatsOnCard
                      branchSlug={branchSlug}
                      themeColor={themeColor}
                      {...card}
                      backgroundColor={background}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="whats-on-latest-empty">
              <AnimateOnScroll triggerClass="fadeIn" className="whats-on-latest-empty-content">
                <p className="type-d-body-m type-m-body-s letter-spacing-002">{emptyMessage}</p>
              </AnimateOnScroll>
            </div>
          )}
        </div>
      </div>

      <AnimateOnScroll triggerClass="fadeIn">
        <Link
          href="/whats-on"
          className="banner-button"
          style={
            {
              '--button-bg-color': allBranchesBackground,
              '--button-text-color': allBranchesTextColor,
            } as CSSProperties
          }
        >
          <p className="type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002">
            <span className="show-md"> EXPLORE FROM ALL BRANCHES</span>
            <span className="hidden-device-md">EXPLORE ALL BRANCH</span>
          </p>

          <i className="ic ic-body-arrow-right"></i>
        </Link>
      </AnimateOnScroll>
    </section>
  )
}
