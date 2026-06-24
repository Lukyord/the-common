'use client'

import type { CSSProperties } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { TabContainer, TabContent, TabContents, TabItem, TabLink, useTabContext } from '@/components/common/tab'

import VenueRentalPanel from './VenueRentalPanel'
import type { VenueRentalBranchGroup } from './types'
import { useVenueRentalPanelMinHeight } from './useVenueRentalPanelMinHeight'

type VenueRentalLandingProps = {
  groups: VenueRentalBranchGroup[]
}

function VenueRentalTabContents({ groups }: { groups: VenueRentalBranchGroup[] }) {
  const { activeTab } = useTabContext()
  const tabContentsRef = useVenueRentalPanelMinHeight(activeTab)

  return (
    <TabContents ref={tabContentsRef} className="venue-rental-tab-contents">
      {groups.map((group) => (
        <TabContent key={group.tabId} tabId={group.tabId}>
          <VenueRentalPanel group={group} />
        </TabContent>
      ))}
    </TabContents>
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
      <AnimateOnScroll
        triggerClass="fadeIn"
        delay={400}
        className="venue-rental-tabs"
        aria-label="Venue rental branches"
      >
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
      </AnimateOnScroll>

      <VenueRentalTabContents groups={groups} />
    </TabContainer>
  )
}
