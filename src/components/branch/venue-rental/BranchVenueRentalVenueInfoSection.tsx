'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import React from 'react'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import type { ContentSingleGalleryItem } from '@/components/common/content-single/types'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import RenderMedia from '@/components/common/media'
import { TabContainer, TabContent, TabContents, TabItem, TabLink } from '@/components/common/tab'
import { getVenueAmenityIconClass } from '@/constants/venueAmenityIcons'

import type {
  BranchVenueRentalVenueInfoIconItem,
  BranchVenueRentalVenueInfoItem,
} from './toBranchVenueRentalVenueInfoProps'

import 'swiper/css'
import 'swiper/css/pagination'

type BranchVenueRentalVenueInfoSectionProps = {
  venues: BranchVenueRentalVenueInfoItem[]
}

function VenueInfoGallery({ items }: { items: ContentSingleGalleryItem[] }) {
  if (!items.length) return null

  return (
    <div className="venue-info-gallery">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        slidesPerView={1}
        observer
        observeParents
        speed={1000}
      >
        {items.map((item, index) => (
          <SwiperSlide key={`${item.src}-${index}`}>
            <div className="venue-info-gallery__media">
              <RenderMedia src={item.src} alt={item.alt} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

function VenueInfoIconGrid({ items }: { items: BranchVenueRentalVenueInfoIconItem[] }) {
  if (!items.length) return null

  return (
    <div className="venue-info-icon-grid">
      {items.map((item, index) => (
        <AnimateOnScroll
          triggerClass="fadeIn"
          key={`${item.icon ?? 'icon'}-${item.text ?? index}`}
          className="venue-info-icon-grid__item"
        >
          {item.icon && (
            <div className="icon">
              <i className={`ic ${getVenueAmenityIconClass(item.icon)}`} aria-hidden />
            </div>
          )}
          {item.text && <span className="text">{item.text}</span>}
        </AnimateOnScroll>
      ))}
    </div>
  )
}

function VenueInfoPanel({ venue }: { venue: BranchVenueRentalVenueInfoItem }) {
  return (
    <div className="venue-info-panel">
      <VenueInfoGallery items={venue.galleryItems} />

      <div className="container venue-info-panel__bottom">
        <div className="venue-info-panel__left">
          {venue.amenitiesDescription && (
            <AnimateOnScroll triggerClass="fadeIn" className="venue-info-panel__block">
              <h3 className="type-d-title type-m-headliner-m weight-medium letter-spacing-002 uppercase">
                Amenities
              </h3>
              <div className="venue-info-panel__venue-description type-d-body-l type-m-title letter-spacing-002">
                <LexicalToHTML data={venue.amenitiesDescription as SerializedEditorState} />
              </div>
            </AnimateOnScroll>
          )}

          {venue.venueDescription.length > 0 && (
            <div className="venue-info-panel__venue-description-grid">
              {venue.venueDescription.map((block, index) =>
                block.content ? (
                  <div
                    className="type-d-body-xs type-m-body-s letter-spacing-002"
                    key={block.id ?? index}
                  >
                    <AnimateOnScroll triggerClass="fadeIn">
                      <p>{index + 1}</p>
                    </AnimateOnScroll>
                    <LexicalToHTML
                      key={block.id ?? index}
                      data={block.content as SerializedEditorState}
                    />
                  </div>
                ) : null,
              )}
            </div>
          )}
        </div>

        <div className="venue-info-panel__right">
          {(venue.information.area || venue.information.numberOfPeople) && (
            <div className="venue-info-panel__block-divider">
              <AnimateOnScroll triggerClass="fadeIn" className="block-ttl">
                <h3 className="type-d-body-m type-m-title weight-medium letter-spacing-002 uppercase">
                  Information
                </h3>
              </AnimateOnScroll>

              <div className="items-container">
                {venue.information.area && (
                  <AnimateOnScroll triggerClass="fadeIn" className="block-desc">
                    <p className="type-d-body-xs type-m-body-s letter-spacing-002 uppercase">
                      Area
                    </p>
                    <p className="type-d-body-text-link type-m-body-r letter-spacing-002 weight-medium">
                      {venue.information.area}
                    </p>
                  </AnimateOnScroll>
                )}
                <div className="divider" />
                {venue.information.numberOfPeople && (
                  <AnimateOnScroll triggerClass="fadeIn" className="block-desc">
                    <p className="type-d-body-xs type-m-body-s letter-spacing-002 uppercase">
                      <span className="show-md">NUMBER OF HOSTS</span>
                      <span className="hidden-device-md">NO. OF HOSTS</span>
                    </p>
                    <p className="type-d-body-text-link type-m-body-r letter-spacing-002 weight-medium">
                      {venue.information.numberOfPeople}
                    </p>
                  </AnimateOnScroll>
                )}
                <div className="divider show-md" />
                <AnimateOnScroll triggerClass="fadeIn" className="block-desc">
                  <p className="type-d-body-xs type-m-body-s letter-spacing-002 uppercase">
                    Available Hours
                  </p>
                  <p className="type-d-body-text-link type-m-body-r letter-spacing-002">
                    <span className="weight-medium">Everyday</span>
                    <span> 08:00 am – Midnight</span>
                  </p>
                </AnimateOnScroll>
              </div>
            </div>
          )}

          {venue.venueAmenities.length > 0 && (
            <div className="venue-info-panel__block">
              <AnimateOnScroll triggerClass="fadeIn" className="block-ttl">
                <h3 className="type-d-body-m type-m-title weight-medium letter-spacing-002 uppercase">
                  VENUE AMENITIES
                </h3>
              </AnimateOnScroll>

              <VenueInfoIconGrid items={venue.venueAmenities} />
            </div>
          )}

          {venue.otherAmenities.length > 0 && (
            <div className="venue-info-panel__block">
              <AnimateOnScroll triggerClass="fadeIn" className="block-ttl">
                <h3 className="type-d-body-m type-m-title weight-medium letter-spacing-002 uppercase">
                  OTHER AMENITIES
                </h3>
              </AnimateOnScroll>

              <VenueInfoIconGrid items={venue.otherAmenities} />
            </div>
          )}

          {venue.additionalFee.length > 0 && (
            <div className="venue-info-panel__block">
              <AnimateOnScroll triggerClass="fadeIn" className="block-ttl">
                <h3 className="type-d-body-m type-m-title weight-medium letter-spacing-002 uppercase">
                  ADDITIONAL FEE
                </h3>
              </AnimateOnScroll>
              <VenueInfoIconGrid items={venue.additionalFee} />
            </div>
          )}

          {(venue.staffFee.title || venue.staffFee.info.length > 0) && (
            <AnimateOnScroll triggerClass="fadeIn" delay={250} className="venue-info-panel__block">
              <AnimateOnScroll triggerClass="fadeIn" className="block-ttl">
                <h3 className="type-d-body-m type-m-title weight-medium letter-spacing-002 uppercase">
                  {venue.staffFee.title}
                </h3>
              </AnimateOnScroll>

              <div className="block-desc-table">
                {venue.staffFee.info.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.title && (
                      <AnimateOnScroll triggerClass="fadeIn" className="fadeIn">
                        <p>{item.title}</p>
                      </AnimateOnScroll>
                    )}
                    {item.description && (
                      <AnimateOnScroll triggerClass="fadeIn" className="fadeIn">
                        <p>{item.description}</p>
                      </AnimateOnScroll>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </AnimateOnScroll>
          )}

          {venue.cta && (
            <AnimateOnScroll triggerClass="fadeIn" className="venue-info-panel__cta">
              <Link
                href={venue.cta.link}
                className={`button-template c-dark-brown-hover ${venue.cta.link ? '' : 'disabled'}`}
                style={{ '--button-bg-color': venue.cta.buttonBgColor } as CSSProperties}
              >
                <span>
                  <span>{venue.cta.text}</span>
                </span>
              </Link>
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </div>
  )
}

function VenueInfoTabContents({ venues }: { venues: BranchVenueRentalVenueInfoItem[] }) {
  return (
    <TabContents className="venue-info-tab-contents">
      {venues.map((venue) => (
        <TabContent key={venue.tabId} tabId={venue.tabId}>
          <VenueInfoPanel venue={venue} />
        </TabContent>
      ))}
    </TabContents>
  )
}

function VenueInfoTabs({ venues }: { venues: BranchVenueRentalVenueInfoItem[] }) {
  return (
    <AnimateOnScroll triggerClass="fadeIn" className="venue-info-tabs">
      {venues.map((venue) => {
        const tabStyle = {
          '--venue-info-tab-bg': venue.buttonBgColor ?? undefined,
          '--venue-info-tab-color': venue.buttonTextColor ?? undefined,
        } as CSSProperties

        return (
          <TabItem key={venue.tabId} tabId={venue.tabId} className="venue-info-tabs__item">
            <TabLink
              tabId={venue.tabId}
              className="venue-info-tabs__link type-d-title type-m-body-m weight-medium letter-spacing-002"
              style={tabStyle}
            >
              {venue.title}
            </TabLink>
          </TabItem>
        )
      })}
    </AnimateOnScroll>
  )
}

export default function BranchVenueRentalVenueInfoSection({
  venues,
}: BranchVenueRentalVenueInfoSectionProps) {
  if (!venues.length) return null

  const defaultActiveTab = venues[0]?.tabId

  return (
    <TabContainer
      containerId="branch-venue-info-tabs"
      defaultActiveTab={defaultActiveTab}
      className="venue-info-tabs-container dark-bg"
    >
      <VenueInfoTabs venues={venues} />
      <VenueInfoTabContents venues={venues} />
    </TabContainer>
  )
}
