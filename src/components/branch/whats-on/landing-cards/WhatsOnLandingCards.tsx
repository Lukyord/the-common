'use client'

import { useRef } from 'react'

import { WhatsOnLandingCard } from './WhatsOnLandingCard'
import type { WhatsOnLandingCardData } from './types'
import { useWhatsOnLandingCards } from './useWhatsOnLandingCards'

type WhatsOnLandingCardsProps = {
  cards: WhatsOnLandingCardData[]
}

export default function WhatsOnLandingCards({ cards }: WhatsOnLandingCardsProps) {
  const playfieldRef = useRef<HTMLDivElement>(null)
  const interaction = useWhatsOnLandingCards(cards.length, playfieldRef)

  if (cards.length === 0) return null

  return (
    <div className="whats-on-landing-card-wrapper">
      <div className="whats-on-landing-playfield" ref={playfieldRef}>
        <div className="whats-on-landing-card-measure" aria-hidden />
        {interaction.layoutsReady && (
          <div className="whats-on-landing-cards-layer">
            {cards.map((card, index) => {
              const layout = interaction.getCardLayout(index)
              if (!layout) return null

              return (
                <WhatsOnLandingCard
                  key={card.id ?? `whats-on-landing-card-${index}`}
                  card={card}
                  index={index}
                  x={layout.x}
                  y={layout.y}
                  rotation={layout.rotation}
                  zIndex={interaction.getCardZIndex(index)}
                  isFlipped={interaction.isCardFlipped(index)}
                  isDragging={interaction.draggingCardIndex === index}
                  onPointerDown={interaction.onCardPointerDown(index)}
                  onActivate={() => {
                    interaction.bringCardToFront(index)
                    interaction.handleCardClick(index)
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
