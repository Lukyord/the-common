'use client'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import { TextCursor, useTextCursor } from '@/components/common/text-cursor'
import type { BranchWhatsOnPage } from '@/payload-types'
import { useState } from 'react'

import WhatsOnLandingCards from './landing-cards/WhatsOnLandingCards'

type WhatsOnLandingProps = {
  data?: BranchWhatsOnPage['landing']
}

export default function WhatsOnLanding({ data }: WhatsOnLandingProps) {
  const cards = data?.cards ?? []
  const textCursor = useTextCursor()
  const [isDragging, setIsDragging] = useState(false)
  const showTextCursor = textCursor.isActive && !isDragging

  if (!data?.title && cards.length === 0) return null

  return (
    <section
      data-section="page-hero"
      className="bg-dark-brown whats-on-landing"
      {...textCursor.getSectionProps(isDragging)}
    >
      {showTextCursor && (
        <TextCursor x={textCursor.position.x} y={textCursor.position.y} label="Flip card!" />
      )}
      <div className="sc-inner pc-t-100 pc-b-75 mb-t-100 mb-b-100">
        <div className="container">
          {data.title && (
            <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h1"
                inline
                className="type-d-display type-m-display weight-medium"
              >
                {data.title}
              </MarkdownContent>
            </AnimateOnScroll>
          )}
        </div>
      </div>

      {cards.length > 0 && <WhatsOnLandingCards cards={cards} onDraggingChange={setIsDragging} />}
    </section>
  )
}
