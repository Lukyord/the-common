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
import type { Branch } from '@/payload-types'

import { getBranchFloorById } from '../lib/shared'
import { getVendorByLot } from '../lib/utils'
import MapLot from './MapLot'
import MapPin from './MapPin'
import MapPlanMedia from './MapPlanMedia'
import StoreInfo from './StoreInfo'
import { MarkdownContent } from '@/components/common/markdown-content'

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
  floors?: Branch['floors']
  selectedFloor: VendorMapFloorId
  onFloorSelect: (floorId: VendorMapFloorId) => void
  onStoreSelect: (lotNumber: number, floor: VendorMapFloorId) => void
  onStoreHover: (lotNumber: number, floor: VendorMapFloorId) => void
  onMapOnlyLotSelect: (mapKey: string, floor: VendorMapFloorId) => void
  onMapOnlyLotHover: (mapKey: string, floor: VendorMapFloorId) => void
  selectedLotNumber?: number
  selectedMapKey?: string
  branchSlug: string
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
  floors,
  selectedFloor,
  onFloorSelect,
  onStoreSelect,
  onStoreHover,
  onMapOnlyLotSelect,
  onMapOnlyLotHover,
  selectedLotNumber,
  selectedMapKey,
  branchSlug,
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
          Object.entries(floorMapOnlyLots).map(([mapKey, lot]) => {
            const { storeInfo, ...lotShape } = lot
            const isInteractive = Boolean(storeInfo?.name)
            const spaceRentalLink = `/${branchSlug}/space-rental`

            return (
              <MapLot
                key={mapKey}
                mapKey={mapKey}
                interactive={isInteractive}
                label={storeInfo?.name ?? mapKey.charAt(0).toUpperCase() + mapKey.slice(1)}
                href={isInteractive && !isMobile ? spaceRentalLink : undefined}
                isActive={selectedMapKey === mapKey}
                defaultColor={defaultColor}
                activeColor={activeColor}
                onClick={
                  isInteractive && isMobile
                    ? () => onMapOnlyLotSelect(mapKey, displayedFloor)
                    : undefined
                }
                onMouseEnter={
                  isInteractive ? () => onMapOnlyLotHover(mapKey, displayedFloor) : undefined
                }
                {...lotShape}
              />
            )
          })}

        {displayedAmenity ? (
          <div className={amenityPinsClassName}>
            {displayedAmenity.pins.map((pin, index) => (
              <MapPin key={`${displayedAmenity.id}-${index}`} layout={pin} color={pinColor} />
            ))}
          </div>
        ) : null}

        {/* <MapPin key={`test-0`} layout={{ top: '25%', left: '69%' }} color={pinColor} /> */}
      </div>

      <div className="floors-container map-plan-interactive">
        {config.floors.map((floor) => {
          const branchFloor = getBranchFloorById(floors, floor.id)
          const label = branchFloor?.text ?? floor.label

          return (
            <button
              key={floor.id}
              className={`floor-trigger${selectedFloor === floor.id ? ' is-active' : ''}`}
              type="button"
              aria-pressed={selectedFloor === floor.id}
              onClick={() => onFloorSelect(floor.id)}
            >
              <MarkdownContent
                as="p"
                className="type-d-body-l uppercase weight-medium letter-spacing-002"
              >
                {label}
              </MarkdownContent>
            </button>
          )
        })}
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
