'use client'

import Link from 'next/link'
import { useCallback, useState, type CSSProperties } from 'react'

import type { GridCardLoadMoreResult } from '@/components/branch/GridCardContainer/types'
import {
  AccordionContainer,
  AccordionItem,
  AccordionPanel,
  AccordionTitle,
} from '@/components/common/accordion'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import type { BranchLandingWhatsOnCard, WhatsOnCalendarMonth } from '@/payload/queries/branch'
import WhatsOnCardHorizontal from '@/components/branch/components/whats-on-card/WhatsOnCardHorizontal'
import type { WhatsOnCardHorizontalProps } from '@/components/branch/components/whats-on-card/WhatsOnCardHorizontal'

type WhatsOnGlobalCalendarProps = {
  title?: string | null
  description?: string | null
  background?: string | null
  eventArchiveBackground?: string | null
  months: WhatsOnCalendarMonth[]
  mainTagIds: number[]
}

type CalendarMonthPanelProps = {
  month: WhatsOnCalendarMonth
  mainTagIds: number[]
}

function getCardThemeColor(
  branches: BranchLandingWhatsOnCard['branches'],
): WhatsOnCardHorizontalProps['themeColor'] | undefined {
  if (branches.length !== 1) return undefined

  const [branch] = branches
  if (!branch?.bgColor || !branch?.primaryColor) return undefined

  return {
    bgColor: branch.bgColor,
    color: branch.primaryColor,
  }
}

function CalendarMonthPanel({ month, mainTagIds }: CalendarMonthPanelProps) {
  const [cards, setCards] = useState(month.cards)
  const [hasMore, setHasMore] = useState(month.hasMore)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        year: String(month.year),
        month: String(month.month),
        mainTags: mainTagIds.join(','),
      })
      const response = await fetch(`/api/cards/whats-on-calendar?${params.toString()}`)

      if (!response.ok) return

      const data = (await response.json()) as GridCardLoadMoreResult<BranchLandingWhatsOnCard>

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
  }, [hasMore, isLoading, mainTagIds, month.month, month.year, page])

  return (
    <>
      {cards.length > 0 ? (
        <div className="card-container" data-card-layout="grid">
          {cards.map((card) => (
            <WhatsOnCardHorizontal
              className="horizontal"
              key={card.id}
              branchSlug={card.branches[0]?.slug}
              {...card}
              themeColor={getCardThemeColor(card.branches)}
              backgroundColor="var(--color-beige)"
            />
          ))}
        </div>
      ) : (
        <p className="whats-on-calendar-empty type-d-body-m type-m-body-s letter-spacing-002">
          No events scheduled for this month.
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
              <span>{isLoading ? 'LOADING...' : 'SEE MORE'}</span>
            </span>
          </button>
        </div>
      ) : null}
    </>
  )
}

export default function WhatsOnGlobalCalendar({
  title,
  description,
  background,
  eventArchiveBackground,
  months,
  mainTagIds,
}: WhatsOnGlobalCalendarProps) {
  if (!title && !months.length) return null

  return (
    <section
      data-section="whats-on-calendar"
      className="dark-bg"
      style={{ backgroundColor: background ?? undefined } as CSSProperties}
    >
      <div className="sc-inner pc-t-100 pc-b-100 mb-t-75 mb-b-75">
        <div className="container">
          {(title || description) && (
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

              {description && (
                <AnimateOnScroll triggerClass="fadeIn" className="sc-desc">
                  <p className="type-d-body-m type-m-body-r letter-spacing-002 c-white">
                    {description}
                  </p>
                </AnimateOnScroll>
              )}
            </div>
          )}

          {months.length > 0 && (
            <AccordionContainer triggerFirst toggle scrollToTop>
              {months.map((month) => (
                <AccordionItem key={month.id} itemId={month.id}>
                  <AnimateOnScroll triggerClass="fadeIn">
                    <AccordionTitle itemId={month.id}>
                      <span className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium uppercase">
                        {month.title}
                      </span>
                    </AccordionTitle>
                  </AnimateOnScroll>
                  <AccordionPanel innerClassName="entry-panel-inner">
                    <CalendarMonthPanel month={month} mainTagIds={mainTagIds} />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </AccordionContainer>
          )}
        </div>
      </div>

      <AnimateOnScroll triggerClass="fadeIn">
        <Link
          href="/whats-on/archive"
          className="banner-button c-dark-brown"
          style={
            {
              '--button-bg-color': eventArchiveBackground ?? 'var(--color-saladaeng-orange)',
            } as CSSProperties
          }
        >
          <p className="type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002">
            <span>EVENT ARCHIVE</span>
          </p>

          <i className="ic ic-body-arrow-right"></i>
        </Link>
      </AnimateOnScroll>
    </section>
  )
}
