import Link from 'next/link'
import type { Metadata } from 'next'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { generateMeta } from '@/lib/generateMeta'
import { CSSProperties } from 'react'

export const metadata: Metadata = generateMeta({
  fallbackTitle: 'Page not found | The Common',
  fallbackDescription: 'The page you are looking for could not be found.',
})

export default function NotFound() {
  return (
    <main id="main" className="not-found-page">
      <section
        data-section="not-found"
        className="header-margin bg-dark-brown"
        aria-labelledby="not-found-title"
      >
        <div className="sc-inner pc-t-100 pc-b-100 mb-t-100 mb-b-100">
          <div className="container">
            <div className="sc-header">
              <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-ttl">
                <h1
                  id="not-found-title"
                  className="type-d-display type-m-display weight-medium letter-spacing-002"
                >
                  Page not found
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll delay={450} className="sc-desc" triggerClass="fadeIn">
                <p className="type-d-body-l type-m-body-r letter-spacing-002">
                  The page you are looking for could not be found.
                </p>
              </AnimateOnScroll>
            </div>
            <AnimateOnScroll triggerClass="fadeIn" className="hidden-device-md sc-cta" delay={600}>
              <Link
                href="/"
                className="button-template"
                style={{ '--button-bg-color': 'var(--color-saladaeng-orange)' } as CSSProperties}
              >
                <span>
                  <span>Back to home</span>
                </span>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </main>
  )
}
