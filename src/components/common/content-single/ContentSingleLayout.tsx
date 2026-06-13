import React from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import BackLink from '@/components/common/BackLink'

import ContentSingleGallery from './ContentSingleGallery'
import ContentSingleSocial from './ContentSingleSocial'
import type { ContentSingleLayoutProps } from './types'

export default function ContentSingleLayout({
  children,
  backHref,
  gallery,
  socials,
  section = 'content-single',
  sectionClassName,
}: ContentSingleLayoutProps) {
  return (
    <section data-section={section} className={sectionClassName}>
      <div className="content-container">
        <div className="back-wrapper hidden-device-md">
          <BackLink fallbackHref={backHref} className="back">
            <i className="ic ic-arrow-left size-icon-2xs"></i>
            <p className="letter-spacing-002 weight-medium">BACK</p>
          </BackLink>
        </div>

        <AnimateOnScroll triggerClass="fadeIn" className="content-text">
          {socials && <ContentSingleSocial links={socials} />}

          <div className="back-wrapper show-md">
            <BackLink fallbackHref={backHref} className="back">
              <i className="ic ic-arrow-left size-icon-2xs"></i>
              <p className="letter-spacing-002 weight-medium">BACK</p>
            </BackLink>
          </div>

          <div className="content-scroll" data-lenis-prevent>
            {children}
          </div>
        </AnimateOnScroll>

        {gallery && <ContentSingleGallery items={gallery.items} bgColor={gallery.bgColor} />}
      </div>
    </section>
  )
}
