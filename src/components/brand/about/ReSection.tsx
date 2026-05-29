'use client'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import RenderMedia from '@/components/common/media'
import React, { useState } from 'react'

const RE_TRIGGERS = [
  {
    type: 'reuse',
    image: '/designs/re-1.webp',
    pattern: '/designs/re-pattern-1.webp',
    alt: 'REUSE',
    title: 'ReUSE',
  },
  {
    type: 'recycle',
    image: '/designs/re-2.webp',
    pattern: '/designs/re-pattern-2.webp',
    alt: 'RECYCLE',
    title: 'Recycle',
  },
  {
    type: 'refill',
    image: '/designs/re-3.webp',
    pattern: '/designs/re-pattern-3.webp',
    alt: 'REFILL',
    title: 'Refill',
  },
  {
    type: 'redistribute',
    image: '/designs/re-4.webp',
    pattern: '/designs/re-pattern-4.webp',
    alt: 'REDISTRIBUTE',
    title: (
      <>
        Re-
        <br />
        distribute
      </>
    ),
  },
] as const

type ReType = (typeof RE_TRIGGERS)[number]['type']

export const ReSection = () => {
  const [activeType, setActiveType] = useState<ReType>('reuse')
  const [hasTriggerHover, setHasTriggerHover] = useState(false)

  return (
    <section data-section="about-re">
      <div className="sc-inner">
        <div className="container">
          <div className="sc-header">
            <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h2"
                className="type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002"
              >
                {'ONE COMMUNITY.\nONE PLANET. ONE LOVE.'}
              </MarkdownContent>
            </AnimateOnScroll>
            <AnimateOnScroll triggerClass="fadeIn" className="sc-desc">
              <MarkdownContent as="p" className="type-d-body-m type-m-body-r letter-spacing-002">
                Discover easy ways to REUSE, RECYCLE, REFILL & REDISTRIBUTE resources at theCOMMONS.
                Small acts create meaningful impacts.
              </MarkdownContent>
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
            <div
              className={`
                  trigger-wrapper 
                  ${hasTriggerHover ? 'has-trigger-hover' : ''}
                `}
            >
              {RE_TRIGGERS.map(({ type, pattern, alt, title }) => (
                <AnimateOnScroll
                  key={type}
                  triggerClass="fadeIn"
                  className={`re-trigger`}
                  data-type={type}
                  onMouseEnter={() => {
                    setActiveType(type)
                    setHasTriggerHover(true)
                  }}
                  onMouseLeave={() => {
                    setHasTriggerHover(false)
                  }}
                >
                  <div className="cover">
                    <RenderMedia src={pattern} alt={alt} />
                  </div>
                  <div className="text">
                    <h3>{title}</h3>
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
