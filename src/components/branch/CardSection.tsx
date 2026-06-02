'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import type { MoodVendorCard } from '@/components/brand/homepage/mood/mapMoodVendorCard'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

type CardSectionProps<TCard = MoodVendorCard> = {
  sectionClassName?: string
  scInnerClassName?: string
  title?: string | null
  cards: TCard[]
  cta?: {
    label: string
    href: string
    buttonClassName?: string
    buttonColor?: string
  }
  showBranch?: boolean
  renderCard?: (card: TCard, index: number) => ReactNode
  getCardKey?: (card: TCard, index: number) => string | number
}

export default function CardSection<TCard = MoodVendorCard>({
  sectionClassName,
  scInnerClassName,
  title,
  cards = [],
  cta,
  showBranch = false,
  renderCard,
  getCardKey,
}: CardSectionProps<TCard>) {
  if (!title && cards.length === 0) return null

  return (
    <section data-section="card-section" className={sectionClassName}>
      <div className={`sc-inner ${scInnerClassName}`}>
        <div className="container">
          <div className="sc-header">
            {title && (
              <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
                <MarkdownContent
                  as="h2"
                  className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium uppercase"
                >
                  {title}
                </MarkdownContent>
              </AnimateOnScroll>
            )}
            {cta?.label && cta?.href && (
              <div className="sc-cta">
                <Link
                  href={cta.href}
                  className="button-template"
                  style={{ '--button-bg-color': cta.buttonColor } as React.CSSProperties}
                >
                  <span>
                    <span>{cta.label}</span>
                  </span>
                </Link>
              </div>
            )}
          </div>

          {cards.length > 0 && (
            <div className="card-container" data-card-layout="slider">
              <Swiper modules={[Pagination]} pagination={{ clickable: true }} slidesPerView="auto">
                {renderCard &&
                  cards.map((card, index) => (
                    <SwiperSlide key={getCardKey?.(card, index) ?? index}>
                      {renderCard(card, index)}
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
