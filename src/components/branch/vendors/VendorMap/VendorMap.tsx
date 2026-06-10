'use client'

import RenderMedia from '@/components/common/media'
import {
  getVendorMapConfig,
  getVendorMapDefaultFloorId,
  getVendorMapFloor,
  type VendorMapFloorId,
} from '@/constants/vendorMapData'
import { useEffect, useRef, useState } from 'react'

import MapLot from './MapLot'
import { getFloorLots } from './lots'
import { useMapPanZoom } from './useMapPanZoom'
import { getFloorVendors } from './vendorMapUtil'

import './styles.css'

const FADE_OUT_DURATION_MS = 200
const FADE_IN_DURATION_MS = 400

const FALLBACK_DEFAULT_MAP_TILE_COLOR = '#CFEAE0'
const FALLBACK_ACTIVE_MAP_TILE_COLOR = '#15E8BF'

type MapTransitionState = 'idle' | 'fading-out' | 'fading-in'

type MapPlanMediaProps = {
  src: string
  alt: string
  transitionState: MapTransitionState
  overlay?: boolean
}

function MapPlanMedia({ src, alt, transitionState, overlay = false }: MapPlanMediaProps) {
  const className = [
    'map-plan__media',
    overlay && 'plan-overlay',
    transitionState === 'fading-out' && 'is-fading-out',
    transitionState === 'fading-in' && 'is-fading-in',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <RenderMedia key={src} src={src} alt={alt} />
    </div>
  )
}

type VendorMapProps = {
  branchSlug: string
  defaultMapTileColor?: string | null
  activeMapTileColor?: string | null
}

export default function VendorMap({
  branchSlug,
  defaultMapTileColor,
  activeMapTileColor,
}: VendorMapProps) {
  const config = getVendorMapConfig(branchSlug)
  const defaultColor = defaultMapTileColor ?? FALLBACK_DEFAULT_MAP_TILE_COLOR
  const activeColor = activeMapTileColor ?? FALLBACK_ACTIVE_MAP_TILE_COLOR
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panzoomRef = useMapPanZoom(viewportRef, stageRef)
  const [selectedFloor, setSelectedFloor] = useState<VendorMapFloorId>(() => {
    const branchConfig = getVendorMapConfig(branchSlug)
    return branchConfig ? getVendorMapDefaultFloorId(branchConfig) : ''
  })
  const [displayedFloor, setDisplayedFloor] = useState<VendorMapFloorId>(selectedFloor)
  const [transitionState, setTransitionState] = useState<MapTransitionState>('idle')

  useEffect(() => {
    if (!config) return
    setSelectedFloor(getVendorMapDefaultFloorId(config))
  }, [branchSlug, config])

  useEffect(() => {
    if (transitionState === 'idle' && selectedFloor !== displayedFloor) {
      setTransitionState('fading-out')
    }
  }, [selectedFloor, displayedFloor, transitionState])

  useEffect(() => {
    if (transitionState === 'fading-out') {
      const timeout = window.setTimeout(() => {
        setDisplayedFloor(selectedFloor)
        panzoomRef.current?.reset({ animate: false })
        setTransitionState('fading-in')
      }, FADE_OUT_DURATION_MS)
      return () => window.clearTimeout(timeout)
    }

    if (transitionState === 'fading-in') {
      const timeout = window.setTimeout(() => {
        setTransitionState(selectedFloor !== displayedFloor ? 'fading-out' : 'idle')
      }, FADE_IN_DURATION_MS)
      return () => window.clearTimeout(timeout)
    }

    return undefined
  }, [transitionState, selectedFloor, displayedFloor, panzoomRef])

  if (!config) return null

  const displayedFloorData = getVendorMapFloor(config, displayedFloor)
  const floorLots = getFloorLots(branchSlug, displayedFloor)
  const floorVendors = getFloorVendors(branchSlug, displayedFloor)
  const mapMediaProps = {
    src: displayedFloorData.mapSrc,
    alt: displayedFloorData.mapAlt,
    transitionState,
  }

  const handleFloorClick = (floorId: VendorMapFloorId) => {
    if (floorId === selectedFloor) return
    setSelectedFloor(floorId)
  }

  return (
    <section data-section="vendor-map">
      <div className="map" ref={viewportRef}>
        <div className="map-plan" ref={stageRef}>
          <MapPlanMedia {...mapMediaProps} />
          <MapPlanMedia {...mapMediaProps} overlay />

          {floorLots &&
            floorVendors.map((vendor) => {
              const lot = floorLots[vendor.lotNumber]
              if (!lot) return null

              return (
                <MapLot
                  key={vendor.lotNumber}
                  lotNumber={vendor.lotNumber}
                  defaultColor={defaultColor}
                  activeColor={activeColor}
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
              onClick={() => handleFloorClick(floor.id)}
            >
              <p className="type-d-body-l uppercase weight-medium letter-spacing-002">
                {floor.label}
              </p>
            </button>
          ))}
        </div>
        <div className="store-info map-plan-interactive"></div>
      </div>
      <div className="info"></div>
    </section>
  )
}
