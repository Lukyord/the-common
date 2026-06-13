'use client'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import RenderMedia from '@/components/common/media'
import React, { useState } from 'react'

const RE_TRIGGERS = [
  {
    type: 'recycle',
    image: '/designs/re-1.webp',
    bg: '/designs/recycle.webp',
    alt: 'Recycle',
    text: 'Reduce landfill waste at our Recycling Bins, Trash Lucky Station, and Clothing Recycling Station.',
  },
  {
    type: 'reuse',
    image: '/designs/re-2.webp',
    bg: '/designs/reuse.webp',
    alt: 'Reuse',
    text: 'Bring your reusable cups and containers to our eateries. They’ll gladly add your favorite treats.',
  },
  {
    type: 'refill',
    image: '/designs/re-3.webp',
    bg: '/designs/refill.webp',
    alt: 'Refill',
    text: 'Top up at our Water Stations. Donate 20 baht (or more) to our Common Compassion initiative.',
  },
  {
    type: 'redistribute',
    image: '/designs/re-4.webp',
    bg: '/designs/redistribute.webp',
    alt: 'Redistribute',
    text: 'Each contribution to our Common Compassion program helps Bangkok’s underserved communities.',
  },
] as const

type ReType = (typeof RE_TRIGGERS)[number]['type']

export const ReSection = () => {
  const [activeType, setActiveType] = useState<ReType>('recycle')

  return (
    <section data-section="about-re">
      <div className="sc-inner">
        <div className="container">
          <div className="sc-header">
            <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl-logo">
              <RenderMedia src="/designs/re-series-logo.webp" alt="RE Series Logo" />
            </AnimateOnScroll>
          </div>

          <div className="content">
            <div className="media-container">
              <div className="media">
                <div className="clip-hexagon-2">
                  {RE_TRIGGERS.map(({ type, image, alt }) => (
                    <div
                      key={type}
                      className={`media-slide ${activeType === type ? 'is-active' : ''}`}
                      aria-hidden={activeType !== type}
                    >
                      <RenderMedia src={image} alt={alt} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="trigger-wrapper">
              {RE_TRIGGERS.map(({ type, bg, alt }) => (
                <AnimateOnScroll
                  key={type}
                  triggerClass="fadeIn"
                  className={`re-trigger`}
                  data-type={type}
                  onMouseEnter={() => setActiveType(type)}
                >
                  <div className="cover">
                    <RenderMedia src={bg} alt={alt} />
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
            <div className="content-desc">
              {RE_TRIGGERS.map(({ type, text }) => (
                <div
                  key={type}
                  className={`desc-slide ${activeType === type ? 'is-active' : ''}`}
                  aria-hidden={activeType !== type}
                >
                  <MarkdownContent as="p" className="letter-spacing-002 type-d-body-m type-m-body-r">
                    {text}
                  </MarkdownContent>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
