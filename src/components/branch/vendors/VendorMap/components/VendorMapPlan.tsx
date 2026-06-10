import type {
  FloorLots,
  MapVendor,
  VendorMapBranchConfig,
  VendorMapFloorId,
} from '@/constants/vendorMapData/index'
import type { RefObject } from 'react'
import type { CSSProperties } from 'react'

import type { VendorMapListItem } from '@/components/branch/vendors/types'

import { getVendorByLot } from '../lib/utils'
import MapLot from './MapLot'
import MapPlanMedia from './MapPlanMedia'
import StoreInfo from './StoreInfo'

type VendorMapPlanProps = {
  viewportRef: RefObject<HTMLDivElement | null>
  stageRef: RefObject<HTMLDivElement | null>
  mapPlanClassName: string
  mapSrc: string
  mapAlt: string
  floorLots: FloorLots | null
  floorVendors: MapVendor[]
  mapVendors: VendorMapListItem[]
  displayedFloor: VendorMapFloorId
  defaultColor: string
  activeColor: string
  isMobile: boolean
  config: VendorMapBranchConfig
  selectedFloor: VendorMapFloorId
  onFloorSelect: (floorId: VendorMapFloorId) => void
  onStoreSelect: (lotNumber: number, floor: VendorMapFloorId) => void
  onStoreHover: (lotNumber: number, floor: VendorMapFloorId) => void
  storeInfoVendor?: VendorMapListItem
  storeInfoClassName: string
  themeStyle?: CSSProperties
}

export default function VendorMapPlan({
  viewportRef,
  stageRef,
  mapPlanClassName,
  mapSrc,
  mapAlt,
  floorLots,
  floorVendors,
  mapVendors,
  displayedFloor,
  defaultColor,
  activeColor,
  isMobile,
  config,
  selectedFloor,
  onFloorSelect,
  onStoreSelect,
  onStoreHover,
  storeInfoVendor,
  storeInfoClassName,
  themeStyle,
}: VendorMapPlanProps) {
  return (
    <div className="map" ref={viewportRef}>
      <div className={mapPlanClassName} ref={stageRef}>
        <MapPlanMedia src={mapSrc} alt={mapAlt} />
        <MapPlanMedia src={mapSrc} alt={mapAlt} overlay />

        {floorLots &&
          floorVendors.map((vendor) => {
            const lot = floorLots[vendor.lotNumber]
            if (!lot) return null

            const cmsVendor = getVendorByLot(mapVendors, displayedFloor, vendor.lotNumber)

            return (
              <MapLot
                key={vendor.lotNumber}
                lotNumber={vendor.lotNumber}
                defaultColor={defaultColor}
                activeColor={activeColor}
                href={isMobile ? undefined : cmsVendor?.link}
                label={cmsVendor?.name}
                onClick={
                  isMobile ? () => onStoreSelect(vendor.lotNumber, displayedFloor) : undefined
                }
                onMouseEnter={() => onStoreHover(vendor.lotNumber, displayedFloor)}
                {...lot}
              />
            )
          })}
      </div>

      <div className="floors-container map-plan-interactive">
        {config.floors.map((floor) => (
          <button
            key={floor.id}
            className={`floor-trigger${selectedFloor === floor.id ? ' is-active' : ''}`}
            type="button"
            aria-pressed={selectedFloor === floor.id}
            onClick={() => onFloorSelect(floor.id)}
          >
            <p className="type-d-body-l uppercase weight-medium letter-spacing-002">{floor.label}</p>
          </button>
        ))}
      </div>

      {storeInfoVendor ? (
        <StoreInfo vendor={storeInfoVendor} className={storeInfoClassName} style={themeStyle} />
      ) : null}
    </div>
  )
}
