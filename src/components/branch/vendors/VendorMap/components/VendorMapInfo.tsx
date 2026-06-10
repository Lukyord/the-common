import type { MapVendor, VendorMapFloorId } from '@/constants/vendorMapData/index'
import type { CSSProperties } from 'react'

import { MarkdownContent } from '@/components/common/markdown-content'
import type { VendorMapListItem } from '@/components/branch/vendors/types'
import type { Branch } from '@/payload-types'

import VendorFloorList from './VendorFloorList'

type VendorMapInfoProps = {
  infoInnerClassName: string
  displayedBranchFloor: NonNullable<Branch['floors']>[number] | null
  themeStyle?: CSSProperties
  displayedFloor: VendorMapFloorId
  floorVendors: MapVendor[]
  mapVendors: VendorMapListItem[]
  isMobile: boolean
  onStoreHover: (lotNumber: number) => void
  onMobileVendorSelect: (lotNumber: number) => void
}

export default function VendorMapInfo({
  infoInnerClassName,
  displayedBranchFloor,
  themeStyle,
  displayedFloor,
  floorVendors,
  mapVendors,
  isMobile,
  onStoreHover,
  onMobileVendorSelect,
}: VendorMapInfoProps) {
  return (
    <div className="info">
      <div className={infoInnerClassName}>
        <div className="info-header">
          <div className="info-ttl">
            <MarkdownContent
              as="h2"
              className="type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002"
            >
              {displayedBranchFloor?.title}
            </MarkdownContent>
          </div>

          {displayedBranchFloor?.description ? (
            <div className="info-desc">
              <p className="type-d-text-link type-m-body-s letter-spacing-002">
                {displayedBranchFloor.description}
              </p>
            </div>
          ) : null}
        </div>

        <div className="amenity-list">
          <div className="list-ttl">
            <h3 className="type-d-label type-m-body-m uppercase weight-medium letter-spacing-002 uppercase">
              amenities
            </h3>
          </div>
        </div>

        <div className="vendor-list" style={themeStyle}>
          <div className="list-ttl">
            <h3 className="type-d-label type-m-body-m uppercase weight-medium letter-spacing-002 uppercase">
              Our vendors
            </h3>
          </div>
          <VendorFloorList
            key={displayedFloor}
            floorId={displayedFloor}
            mapVendors={floorVendors}
            cmsVendors={mapVendors}
            onVendorMouseEnter={onStoreHover}
            onVendorClick={isMobile ? onMobileVendorSelect : undefined}
          />
        </div>
      </div>
    </div>
  )
}
