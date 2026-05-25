'use client'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Homepage } from '@/payload-types'
import Link from 'next/link'
import { useRef, useState } from 'react'

type ScrollShapeSectionProps = {
  data?: Homepage['peopleOfTheCommons']
}

function toCards(cards: NonNullable<Homepage['peopleOfTheCommons']>['cards']) {
  return (cards ?? []).map((card, index) => ({
    id: card.id ?? `people-card-${index}`,
    title: card.title,
    description: card.description,
    link: card.link,
    media: resolveMedia(card.media),
  }))
}

export const ScrollShapeSection = ({ data }: ScrollShapeSectionProps) => {
  const cards = toCards(data?.cards)
  const trackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [paddingFlipped, setPaddingFlipped] = useState(false)

  const handleTrackScroll = () => {
    const track = trackRef.current
    const content = contentRef.current
    const firstCard = content?.firstElementChild as HTMLElement | undefined
    if (!track || !firstCard) return

    const gap = Number.parseFloat(getComputedStyle(content).gap) || 0
    const step = firstCard.offsetWidth + gap
    const flipped = step > 0 && Math.floor(track.scrollLeft / step) % 2 === 1
    setPaddingFlipped((prev) => (prev === flipped ? prev : flipped))
  }

  if (!data?.title && cards.length === 0) {
    return null
  }

  return (
    <section
      data-section="scroll-shape"
      {...(paddingFlipped ? { 'data-padding-flipped': true } : {})}
    >
      <div className="cover">
        <RenderMedia src="/designs/people-bg.webp" alt="People of the Commons Background" />
      </div>
      <div className="sc-inner">
        <div className="container">
          {data?.title && (
            <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
              <h2 className="type-d-header type-m-headliner-m weight-medium letter-spacing-002">
                {data.title}
              </h2>
            </AnimateOnScroll>
          )}

          {cards.length > 0 && (
            <AnimateOnScroll triggerClass="fadeIn" className="content-wrapper-wrapper">
              <div className="content-wrapper" ref={trackRef} onScroll={handleTrackScroll}>
                <div className="content" ref={contentRef}>
                  {cards.map((card) => (
                    <div key={card.id} className="card" data-card="hexagon-1">
                      <div className="card-media">
                        <div className="clip-hexagon-1">
                          {card.media?.src && (
                            <RenderMedia src={card.media.src} alt={card.media.alt} />
                          )}
                        </div>
                      </div>
                      <div className="card-content">
                        {card.title && (
                          <div className="card-ttl">
                            <h3 className="type-d-title weight-medium type-m-title letter-spacing-002">
                              {card.title}
                            </h3>
                          </div>
                        )}
                        {card.description && (
                          <div className="card-desc">
                            <p className="type-d-body-m letter-spacing-002 type-m-body-r">
                              {card.description}
                            </p>
                          </div>
                        )}
                      </div>
                      {card.link && (
                        <Link
                          href={card.link}
                          className="link-overlay"
                          aria-label={card.title ?? undefined}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </section>
  )
}
