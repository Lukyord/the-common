import Link from 'next/link'
import { CSSProperties } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from './media'

export default function NotFoundContent() {
  return (
    <main id="main" className="not-found-page">
      <section
        data-section="not-found"
        className="header-padding"
        aria-labelledby="not-found-title"
      >
        <div className="sc-inner pc-t-100 pc-b-100 mb-t-50 mb-b-50">
          <div className="container">
            <div className="sc-header">
              <AnimateOnScroll triggerClass="fadeIn" delay={300} className="not-found-illus">
                <RenderMedia src="/designs/not-found-illus.svg" alt="Not Found Illustration" />
              </AnimateOnScroll>

              <AnimateOnScroll delay={450} triggerClass="fadeIn" className="sc-ttl">
                <h1
                  id="not-found-title"
                  className="type-d-header type-m-headliner-m weight-medium letter-spacing-002"
                >
                  Page not found
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll delay={600} className="sc-desc" triggerClass="fadeIn">
                <p className="type-d-body-s type-m-body-s letter-spacing-002">
                  The page you requested couldn’t be found.
                </p>
              </AnimateOnScroll>
            </div>
            <AnimateOnScroll triggerClass="fadeIn" className="sc-cta" delay={600}>
              <Link
                href="/"
                className="button-template"
                style={{ '--button-bg-color': 'var(--color-saladaeng-orange)' } as CSSProperties}
              >
                <span>
                  <span>BACK TO HOME</span>
                </span>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </main>
  )
}
