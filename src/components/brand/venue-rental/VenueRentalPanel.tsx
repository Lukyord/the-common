'use client'

import Link from 'next/link'
import { useState, type CSSProperties } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import { scrollToTop } from '@/utils/functions/scrollTo'

import VenueRentalBookingModal from './booking/VenueRentalBookingModal'
import VenueRentalGallery from './VenueRentalGallery'
import type { VenueRentalBranchGroup } from './types'

type VenueRentalPanelProps = {
  group: VenueRentalBranchGroup
}

export default function VenueRentalPanel({ group }: VenueRentalPanelProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const panelStyle = {
    '--venue-rental-text-color': group.textColor ?? undefined,
    '--venue-rental-bg-color': group.bgColor ?? undefined,
  } as CSSProperties

  const openBookingModal = () => {
    if (window.matchMedia('(max-width: 991px)').matches) {
      scrollToTop({ immediate: true })
    }
    setIsBookingModalOpen(true)
  }

  return (
    <div className="venue-rental-panel" style={panelStyle}>
      <VenueRentalGallery items={group.galleryItems} bgColor={group.bgColor} />

      <div className="venue-rental-panel__content" style={panelStyle}>
        {group.title && (
          <AnimateOnScroll triggerClass="fadeIn" className="venue-rental-panel__title">
            <MarkdownContent
              as="h1"
              className="type-d-display type-m-display weight-medium letter-spacing-002"
            >
              {group.title}
            </MarkdownContent>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll
          triggerClass="fadeIn"
          delay={100}
          className="venue-rental-panel__link-container"
        >
          <Link href={`/${group.branchSlug}/venue-rental`} className="venue-rental-panel__link">
            <span className="type-d-body-l type-m-body-m weight-medium letter-spacing-002 uppercase">
              BRANCH RENTAL DETAIL
            </span>
            <i className="ic ic-arrow-square-top-right"></i>
          </Link>
        </AnimateOnScroll>

        <AnimateOnScroll triggerClass="fadeIn" delay={200} className="venue-rental-panel__info">
          <div className="expand-icon show-md">
            <i className="ic ic-chevron-up size-icon-3xs"></i>
          </div>

          {group.cta?.desc && (
            <MarkdownContent
              as="p"
              className="venue-rental-panel__desc type-d-body-m type-m-body-r letter-spacing-002"
            >
              {group.cta.desc}
            </MarkdownContent>
          )}

          {group.venues.length > 0 && (
            <div className="venue-list info-item">
              <div className="info-item__inner">
                <div className="item-ttl">
                  <h3 className="type-d-body-xs type-m-body-s letter-spacing-002">
                    SPACE FOR RENTAL
                  </h3>
                </div>
                <div className="item-content show-md">
                  <p className="type-d-body-s type-m-title letter-spacing-002 weight-medium">
                    {group.venues.join(', ')}
                  </p>
                </div>
                <ul className="item-content hidden-device-md">
                  {group.venues.map((venue) => (
                    <li key={venue}>
                      <span className="type-d-body-s type-m-title letter-spacing-002 weight-medium">
                        {venue}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="available-time info-item">
            <div className="info-item__inner">
              <div className="item-ttl">
                <h3 className="type-d-body-xs type-m-body-s letter-spacing-002">AVAILABLE TIME</h3>
              </div>
              <div className="item-content">
                <p className="letter-spacing-002">
                  <span className="weight-medium type-d-text-link type-m-body-m">Everyday </span>
                  <span className="type-d-body-m type-m-title">08:00 am – Midnight</span>
                </p>
              </div>
            </div>
          </div>

          {group.cta?.text && (
            <div className="venue-rental-panel__cta">
              <button
                type="button"
                className={[
                  'button-template',
                  group.buttonWhiteTextOnHover && 'c-white-hover',
                  group.buttonDarkBrownTextOnHover && 'c-dark-brown-hover',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--button-bg-color': group.buttonColor } as CSSProperties}
                onClick={openBookingModal}
              >
                <span>
                  <span>{group.cta.text}</span>
                </span>
              </button>
            </div>
          )}
        </AnimateOnScroll>
      </div>

      <VenueRentalBookingModal
        open={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        formTitle={`${group.branchName} Venue Rental`}
        formAreaOptions={group.formAreaOptions}
        bookingCta={group.bookingCta}
      />
    </div>
  )
}
