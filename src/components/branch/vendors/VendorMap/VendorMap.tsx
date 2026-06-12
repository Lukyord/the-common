'use client'

import {
  getFloorAmenities,
  getFloorLots,
  getFloorMapOnlyLots,
  getFloorVendors,
  getVendorMapConfig,
  getVendorMapFloor,
  type AmenityId,
  type VendorMapBranchConfig,
  type VendorMapFloorId,
} from '@/constants/vendorMapData/index'
import { useRef } from 'react'

import { branchHeaderThemeStyle } from '@/lib/branchTheme'

import VendorMapInfo from './components/VendorMapInfo'
import VendorMapPlan from './components/VendorMapPlan'
import { useAmenitySelection } from './hooks/useAmenitySelection'
import { useFloorTransition } from './hooks/useFloorTransition'
import { useIsMobile } from './hooks/useIsMobile'
import { useMapPanZoom } from './hooks/useMapPanZoom'
import { useStoreSelection } from './hooks/useStoreSelection'
import { useVendorMapImagePreload } from './hooks/useVendorMapImagePreload'
import {
  FALLBACK_ACTIVE_MAP_TILE_COLOR,
  FALLBACK_DEFAULT_MAP_TILE_COLOR,
  FALLBACK_PIN_COLOR,
} from './lib/constants'
import { getBranchFloorById, type VendorMapProps } from './lib/shared'

import './styles.css'

type VendorMapContentProps = VendorMapProps & {
  config: VendorMapBranchConfig
}

function VendorMapContent({
  branchSlug,
  floors,
  defaultMapTileColor,
  activeMapTileColor,
  pinColor,
  mapVendors = [],
  branchTheme,
  config,
}: VendorMapContentProps) {
  const themeStyle = branchHeaderThemeStyle(branchTheme)
  const defaultColor = defaultMapTileColor ?? FALLBACK_DEFAULT_MAP_TILE_COLOR
  const activeColor = activeMapTileColor ?? FALLBACK_ACTIVE_MAP_TILE_COLOR
  const resolvedPinColor = pinColor ?? FALLBACK_PIN_COLOR
  const isMobile = useIsMobile()

  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panzoomRef = useMapPanZoom(viewportRef, stageRef)

  const { selectedFloor, displayedFloor, selectFloor, mapPlanClassName, infoInnerClassName } =
    useFloorTransition({
      branchSlug,
      config,
      panzoomRef,
    })

  const floorVendors = getFloorVendors(branchSlug, displayedFloor)
  const floorAmenities = getFloorAmenities(branchSlug, displayedFloor)
  const {
    storeInfoVendor,
    persistedStoreInfoVendor,
    storeInfoClassName,
    selectedLotNumber,
    selectStore,
    hoverStore,
    selectMobileVendor,
    clearStore,
  } = useStoreSelection({
    mapVendors,
    displayedFloor,
    floorVendors,
    isMobile,
    sectionRef,
  })
  useVendorMapImagePreload({
    sectionRef,
    mapVendors,
    displayedFloor,
  })

  const {
    displayedAmenityId,
    hoverAmenity,
    clearAmenity,
    selectMobileAmenity,
    amenityPinsClassName,
  } = useAmenitySelection({
    displayedFloor,
    isMobile,
    sectionRef,
  })

  const displayedFloorData = getVendorMapFloor(config, displayedFloor)
  const floorLots = getFloorLots(branchSlug, displayedFloor)
  const floorMapOnlyLots = getFloorMapOnlyLots(branchSlug, displayedFloor)
  const displayedBranchFloor = getBranchFloorById(floors, displayedFloor)

  const handleStoreHover = (lotNumber: number, floor: VendorMapFloorId) => {
    clearAmenity()
    hoverStore(lotNumber, floor)
  }

  const handleAmenityHover = (amenityId: AmenityId) => {
    clearStore()
    hoverAmenity(amenityId)
  }

  const handleMobileAmenitySelect = (amenityId: AmenityId) => {
    clearStore()
    panzoomRef.current?.reset({ animate: false })
    selectMobileAmenity(amenityId)
  }

  const handleMobileVendorSelect = (lotNumber: number) => {
    clearAmenity()
    selectMobileVendor(lotNumber)
  }

  const handleStoreSelect = (lotNumber: number, floor: VendorMapFloorId) => {
    clearAmenity()
    selectStore(lotNumber, floor)
  }

  const handleSectionLeave = () => {
    if (isMobile) return
    clearStore()
    clearAmenity()
  }

  return (
    <section
      className={`${branchSlug}-map`}
      ref={sectionRef}
      data-section="vendor-map"
      onMouseLeave={handleSectionLeave}
    >
      <VendorMapPlan
        viewportRef={viewportRef}
        stageRef={stageRef}
        mapPlanClassName={mapPlanClassName}
        mapSrc={displayedFloorData.mapSrc}
        mapAlt={displayedFloorData.mapAlt}
        floorLots={floorLots}
        floorMapOnlyLots={floorMapOnlyLots}
        floorAmenities={floorAmenities}
        displayedAmenityId={displayedAmenityId}
        amenityPinsClassName={amenityPinsClassName}
        floorVendors={floorVendors}
        mapVendors={mapVendors}
        displayedFloor={displayedFloor}
        defaultColor={defaultColor}
        activeColor={activeColor}
        pinColor={resolvedPinColor}
        isMobile={isMobile}
        config={config}
        selectedFloor={selectedFloor}
        onFloorSelect={selectFloor}
        onStoreSelect={handleStoreSelect}
        onStoreHover={handleStoreHover}
        selectedLotNumber={selectedLotNumber}
        storeInfoVendor={isMobile && displayedAmenityId ? undefined : storeInfoVendor}
        persistedStoreInfoVendor={
          isMobile && displayedAmenityId ? undefined : persistedStoreInfoVendor
        }
        storeInfoClassName={storeInfoClassName}
        themeStyle={themeStyle}
      />
      <VendorMapInfo
        infoInnerClassName={infoInnerClassName}
        displayedBranchFloor={displayedBranchFloor}
        themeStyle={themeStyle}
        displayedFloor={displayedFloor}
        floorAmenities={floorAmenities}
        floorVendors={floorVendors}
        mapVendors={mapVendors}
        isMobile={isMobile}
        onAmenityLeave={clearAmenity}
        onAmenityHover={handleAmenityHover}
        onMobileAmenitySelect={handleMobileAmenitySelect}
        onStoreHover={(lotNumber) => handleStoreHover(lotNumber, displayedFloor)}
        onMobileVendorSelect={handleMobileVendorSelect}
      />
    </section>
  )
}

export default function VendorMap(props: VendorMapProps) {
  const config = getVendorMapConfig(props.branchSlug)
  if (!config) return null

  return <VendorMapContent {...props} config={config} />
}
