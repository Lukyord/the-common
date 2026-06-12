'use client'

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export type CardSectionPaginationConfig = {
  clickable?: boolean
}

export type CardSectionSliderConfig = {
  navigation?: boolean
  pagination?: boolean | CardSectionPaginationConfig
  speed?: number
}

function resolveSliderPagination(pagination: CardSectionSliderConfig['pagination']) {
  if (!pagination) {
    return { enabled: false, options: false as const }
  }

  return {
    enabled: true,
    options: {
      clickable: typeof pagination === 'object' ? (pagination.clickable ?? true) : true,
    },
  }
}

export type CardSectionProps<TCard> = {
  sectionClassName?: string
  sectionStyle?: CSSProperties
  scInnerClassName?: string
  title?: string | null
  cards: TCard[]
  cta?: {
    label: string
    href: string
    buttonClassName?: string
    buttonColor?: string
  }
  slider?: CardSectionSliderConfig
  renderCard?: (card: TCard, index: number) => ReactNode
  getCardKey?: (card: TCard, index: number) => string | number
}

export default function CardSection<TCard>({
  sectionClassName,
  sectionStyle,
  scInnerClassName,
  title,
  cards = [],
  cta,
  slider,
  renderCard,
  getCardKey,
}: CardSectionProps<TCard>) {
  if (!title && cards.length === 0) return null

  const showNavigation = slider?.navigation === true
  const pagination = resolveSliderPagination(slider?.pagination)
  const modules = [
    ...(showNavigation ? [Navigation] : []),
    ...(pagination.enabled ? [Pagination] : []),
  ]

  return (
    <section data-section="card-section" className={sectionClassName} style={sectionStyle}>
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
              <AnimateOnScroll triggerClass="fadeIn" className="sc-cta">
                <Link
                  href={cta.href}
                  className="button-template"
                  style={{ '--button-bg-color': cta.buttonColor } as React.CSSProperties}
                >
                  <span>
                    <span>{cta.label}</span>
                  </span>
                </Link>
              </AnimateOnScroll>
            )}
          </div>

          {cards.length > 0 && (
            <div className="card-container" data-card-layout="slider">
              <Swiper
                modules={modules}
                navigation={showNavigation}
                speed={slider?.speed ?? 800}
                pagination={pagination.options}
                slidesPerView="auto"
              >
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
