'use client'

import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'

import { MarkdownContent } from '@/components/common/markdown-content'

import type { WhatsOnLandingCardData } from './types'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

type WhatsOnLandingCardProps = {
  card: WhatsOnLandingCardData
  index: number
  x: number
  y: number
  rotation: number
  zIndex: number
  isFlipped: boolean
  isDragging: boolean
  onPointerDown: (event: PointerEvent<HTMLElement>) => void
  onActivate: () => void
}

export function WhatsOnLandingCard({
  card,
  index,
  x,
  y,
  rotation,
  zIndex,
  isFlipped,
  isDragging,
  onPointerDown,
  onActivate,
}: WhatsOnLandingCardProps) {
  const background = card.background || 'var(--color-beige)'
  const pattern = card.pattern ?? undefined

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <div
      className={`whats-on-landing-card${isDragging ? ' is-dragging' : ''}`}
      style={
        {
          left: x,
          top: y,
          zIndex,
          '--card-rotation': `${isFlipped ? 0 : rotation}deg`,
        } as CSSProperties
      }
      onPointerDown={onPointerDown}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={card.front?.title || `Card ${index + 1}`}
    >
      <AnimateOnScroll
        triggerClass="fadeEntry"
        className="whats-on-landing-card-enter"
        style={{ '--entry-delay': `${index * 0.12}s` } as CSSProperties}
      >
        <div className={`whats-on-landing-card-inner${isFlipped ? ' is-flipped' : ''}`}>
          <div
            className="whats-on-landing-card-face whats-on-landing-card-face--front"
            style={{ '--card-bg': background } as CSSProperties}
          >
            {pattern && (
              <div className="whats-on-landing-card-pattern" data-pattern={pattern} aria-hidden />
            )}
            <div className="whats-on-landing-card-content">
              {card.front?.title && (
                <MarkdownContent
                  as="h2"
                  className="type-d-header type-m-title weight-medium letter-spacing-002"
                >
                  {card.front.title}
                </MarkdownContent>
              )}
            </div>
          </div>

          <div
            className="whats-on-landing-card-face whats-on-landing-card-face--back"
            style={{ '--card-bg': background } as CSSProperties}
          >
            {pattern && (
              <div className="whats-on-landing-card-pattern" data-pattern={pattern} aria-hidden />
            )}
            <div className="whats-on-landing-card-content">
              {card.back?.title && (
                <MarkdownContent
                  as="h2"
                  className="type-d-header type-m-title weight-medium letter-spacing-002"
                >
                  {card.back.title}
                </MarkdownContent>
              )}
              {card.back?.description && (
                <MarkdownContent as="p" className="type-d-body-l type-m-body-r letter-spacing-002">
                  {card.back.description}
                </MarkdownContent>
              )}
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </div>
  )
}
