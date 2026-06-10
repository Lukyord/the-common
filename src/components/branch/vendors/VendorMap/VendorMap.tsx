'use client'

import {
  getFloorLots,
  getFloorVendors,
  getVendorMapConfig,
  getVendorMapFloor,
  type VendorMapBranchConfig,
} from '@/constants/vendorMapData/index'
import { useRef } from 'react'

import { branchHeaderThemeStyle } from '@/lib/branchTheme'

import VendorMapInfo from './components/VendorMapInfo'
import VendorMapPlan from './components/VendorMapPlan'
import { useFloorTransition } from './hooks/useFloorTransition'
import { useIsMobile } from './hooks/useIsMobile'
import { useMapPanZoom } from './hooks/useMapPanZoom'
import { useStoreSelection } from './hooks/useStoreSelection'
import { FALLBACK_ACTIVE_MAP_TILE_COLOR, FALLBACK_DEFAULT_MAP_TILE_COLOR } from './lib/constants'
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
  mapVendors = [],
  branchTheme,
  config,
}: VendorMapContentProps) {
  const themeStyle = branchHeaderThemeStyle(branchTheme)
  const defaultColor = defaultMapTileColor ?? FALLBACK_DEFAULT_MAP_TILE_COLOR
  const activeColor = activeMapTileColor ?? FALLBACK_ACTIVE_MAP_TILE_COLOR
  const isMobile = useIsMobile()

  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panzoomRef = useMapPanZoom(viewportRef, stageRef)

  const {
    selectedFloor,
    displayedFloor,
    selectFloor,
    mapPlanClassName,
    infoInnerClassName,
  } = useFloorTransition({
    branchSlug,
    config,
    panzoomRef,
  })

  const floorVendors = getFloorVendors(branchSlug, displayedFloor)
  const {
    storeInfoVendor,
    storeInfoClassName,
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

  const displayedFloorData = getVendorMapFloor(config, displayedFloor)
  const floorLots = getFloorLots(branchSlug, displayedFloor)
  const displayedBranchFloor = getBranchFloorById(floors, displayedFloor)

  return (
    <section ref={sectionRef} data-section="vendor-map" onMouseLeave={clearStore}>
      <VendorMapPlan
        viewportRef={viewportRef}
        stageRef={stageRef}
        mapPlanClassName={mapPlanClassName}
        mapSrc={displayedFloorData.mapSrc}
        mapAlt={displayedFloorData.mapAlt}
        floorLots={floorLots}
        floorVendors={floorVendors}
        mapVendors={mapVendors}
        displayedFloor={displayedFloor}
        defaultColor={defaultColor}
        activeColor={activeColor}
        isMobile={isMobile}
        config={config}
        selectedFloor={selectedFloor}
        onFloorSelect={selectFloor}
        onStoreSelect={selectStore}
        onStoreHover={hoverStore}
        storeInfoVendor={storeInfoVendor}
        storeInfoClassName={storeInfoClassName}
        themeStyle={themeStyle}
      />
      <VendorMapInfo
        infoInnerClassName={infoInnerClassName}
        displayedBranchFloor={displayedBranchFloor}
        themeStyle={themeStyle}
        displayedFloor={displayedFloor}
        floorVendors={floorVendors}
        mapVendors={mapVendors}
        isMobile={isMobile}
        onStoreHover={(lotNumber) => hoverStore(lotNumber, displayedFloor)}
        onMobileVendorSelect={selectMobileVendor}
      />
    </section>
  )
}

export default function VendorMap(props: VendorMapProps) {
  const config = getVendorMapConfig(props.branchSlug)
  if (!config) return null

  return <VendorMapContent {...props} config={config} />
}
