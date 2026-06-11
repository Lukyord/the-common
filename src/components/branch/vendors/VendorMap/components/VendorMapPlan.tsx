import type {
  AmenityId,
  FloorAmenities,
  FloorLots,
  FloorMapOnlyLots,
  MapVendor,
  VendorMapBranchConfig,
  VendorMapFloorId,
} from '@/constants/vendorMapData/index'
import type { RefObject } from 'react'
import type { CSSProperties } from 'react'

import type { VendorMapListItem } from '@/components/branch/vendors/types'

import { getVendorByLot } from '../lib/utils'
import MapLot from './MapLot'
import MapPin from './MapPin'
import MapPlanMedia from './MapPlanMedia'
import StoreInfo from './StoreInfo'

type VendorMapPlanProps = {
  viewportRef: RefObject<HTMLDivElement | null>
  stageRef: RefObject<HTMLDivElement | null>
  mapPlanClassName: string
  mapSrc: string
  mapAlt: string
  floorLots: FloorLots | null
  floorMapOnlyLots: FloorMapOnlyLots | null
  floorAmenities: FloorAmenities
  displayedAmenityId: AmenityId | null
  amenityPinsClassName: string
  floorVendors: MapVendor[]
  mapVendors: VendorMapListItem[]
  displayedFloor: VendorMapFloorId
  defaultColor: string
  activeColor: string
  pinColor: string
  isMobile: boolean
  config: VendorMapBranchConfig
  selectedFloor: VendorMapFloorId
  onFloorSelect: (floorId: VendorMapFloorId) => void
  onStoreSelect: (lotNumber: number, floor: VendorMapFloorId) => void
  onStoreHover: (lotNumber: number, floor: VendorMapFloorId) => void
  selectedLotNumber?: number
  storeInfoVendor?: VendorMapListItem
  persistedStoreInfoVendor?: VendorMapListItem
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
  floorMapOnlyLots,
  floorAmenities,
  displayedAmenityId,
  amenityPinsClassName,
  floorVendors,
  mapVendors,
  displayedFloor,
  defaultColor,
  activeColor,
  pinColor,
  isMobile,
  config,
  selectedFloor,
  onFloorSelect,
  onStoreSelect,
  onStoreHover,
  selectedLotNumber,
  storeInfoVendor,
  persistedStoreInfoVendor,
  storeInfoClassName,
  themeStyle,
}: VendorMapPlanProps) {
  const displayedAmenity = floorAmenities.find((amenity) => amenity.id === displayedAmenityId)

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
                isActive={selectedLotNumber === vendor.lotNumber}
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

        {floorMapOnlyLots &&
          Object.entries(floorMapOnlyLots).map(([mapKey, lot]) => (
            <MapLot
              key={mapKey}
              mapKey={mapKey}
              interactive={false}
              label={mapKey.charAt(0).toUpperCase() + mapKey.slice(1)}
              defaultColor={defaultColor}
              activeColor={activeColor}
              {...lot}
            />
          ))}

        {displayedAmenity ? (
          <div className={amenityPinsClassName}>
            {displayedAmenity.pins.map((pin, index) => (
              <MapPin key={`${displayedAmenity.id}-${index}`} layout={pin} color={pinColor} />
            ))}
          </div>
        ) : null}
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

      {persistedStoreInfoVendor ? (
        <StoreInfo
          vendor={storeInfoVendor ?? persistedStoreInfoVendor}
          className={storeInfoClassName}
          style={themeStyle}
        />
      ) : null}
    </div>
  )
}
