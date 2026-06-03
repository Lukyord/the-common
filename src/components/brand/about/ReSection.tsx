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
  },
  {
    type: 'reuse',
    image: '/designs/re-2.webp',
    bg: '/designs/reuse.webp',
    alt: 'Reuse',
  },
  {
    type: 'refill',
    image: '/designs/re-3.webp',
    bg: '/designs/refill.webp',
    alt: 'Refill',
  },
  {
    type: 'redistribute',
    image: '/designs/re-4.webp',
    bg: '/designs/redistribute.webp',
    alt: 'Redistribute',
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
              <MarkdownContent as="p" className="letter-spacing-002 type-d-body-m type-m-body-r">
                Bring your reusable cups and containers to our eateries. They&apos;ll gladly add
                your favorite treats.
              </MarkdownContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
