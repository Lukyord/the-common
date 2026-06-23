'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'

import { TabContainer, TabContent, TabContents, TabItem, TabLink } from '@/components/common/tab'
import { MarkdownContent } from '@/components/common/markdown-content'

import VenueRentalGallery from './VenueRentalGallery'
import type { VenueRentalBranchGroup } from './types'

type VenueRentalLandingProps = {
  groups: VenueRentalBranchGroup[]
}

function VenueRentalPanel({ group }: { group: VenueRentalBranchGroup }) {
  const panelStyle = {
    '--venue-rental-text-color': group.textColor ?? undefined,
    '--venue-rental-bg-color': group.bgColor ?? undefined,
  } as CSSProperties

  return (
    <div className="venue-rental-panel" style={panelStyle}>
      <VenueRentalGallery items={group.galleryItems} bgColor={group.bgColor} />

      <div className="venue-rental-panel__content" style={panelStyle}>
        <div className="venue-rental-panel__header">
          {group.title ? (
            <MarkdownContent
              as="h1"
              className="venue-rental-panel__title type-d-display type-m-display weight-medium letter-spacing-002"
            >
              {group.title}
            </MarkdownContent>
          ) : null}

          <Link href={`/${group.branchSlug}/venue-rental`} className="venue-rental-panel__link">
            <span className="type-d-body-l type-m-body-m weight-medium letter-spacing-002 uppercase">
              BRANCH RENTAL DETAIL
            </span>
            <i className="ic ic-arrow-square-top-right"></i>
          </Link>
        </div>

        <div className="venue-rental-panel__info">
          <div className="expand-icon">
            <i className="ic ic-chevron-up size-icon-3xs"></i>
          </div>
          {group.cta?.desc ? (
            <MarkdownContent
              as="p"
              className="venue-rental-panel__desc type-d-body-m type-m-body-r letter-spacing-002"
            >
              {group.cta.desc}
            </MarkdownContent>
          ) : null}

          {group.cta?.text ? (
            <div className="venue-rental-panel__cta">
              <Link
                href="/contact"
                className="button-template"
                style={{ '--button-bg-color': group.buttonColor } as CSSProperties}
              >
                <span>
                  <span>{group.cta.text}</span>
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function VenueRentalLanding({ groups }: VenueRentalLandingProps) {
  const defaultActiveTab = groups[0]?.tabId

  return (
    <TabContainer
      containerId="venue-rental-tabs"
      defaultActiveTab={defaultActiveTab}
      className="venue-rental-tabs-container"
    >
      <nav className="venue-rental-tabs" aria-label="Venue rental branches">
        {groups.map((group) => {
          const panelStyle = {
            '--venue-rental-text-color': group.textColor ?? undefined,
            '--venue-rental-bg-color': group.bgColor ?? undefined,
          } as CSSProperties

          return (
            <TabItem key={group.tabId} tabId={group.tabId} className="venue-rental-tabs__item">
              <TabLink
                tabId={group.tabId}
                className="venue-rental-tabs__link type-d-body-l type-m-body-m weight-medium letter-spacing-002 uppercase"
                style={panelStyle}
              >
                {group.branchName}
              </TabLink>
            </TabItem>
          )
        })}
      </nav>

      <TabContents className="venue-rental-tab-contents">
        {groups.map((group) => (
          <TabContent key={group.tabId} tabId={group.tabId}>
            <VenueRentalPanel group={group} />
          </TabContent>
        ))}
      </TabContents>
    </TabContainer>
  )
}
