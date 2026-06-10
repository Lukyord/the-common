'use client'

import RenderMedia from '@/components/common/media'
import {
  getVendorMapConfig,
  getVendorMapDefaultFloorId,
  getVendorMapFloor,
  type VendorMapFloorId,
} from '@/constants/vendorMapData'
import { useEffect, useRef, useState } from 'react'

import { useMapPanZoom } from './useMapPanZoom'

const FADE_OUT_DURATION_MS = 200
const FADE_IN_DURATION_MS = 400

type VendorMapProps = {
  branchSlug: string
}

export default function VendorMap({ branchSlug }: VendorMapProps) {
  const config = getVendorMapConfig(branchSlug)
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panzoomRef = useMapPanZoom(viewportRef, stageRef)
  const [selectedFloor, setSelectedFloor] = useState<VendorMapFloorId>(() => {
    const branchConfig = getVendorMapConfig(branchSlug)
    return branchConfig ? getVendorMapDefaultFloorId(branchConfig) : ''
  })
  const [displayedFloor, setDisplayedFloor] = useState<VendorMapFloorId>(selectedFloor)
  const [transitionState, setTransitionState] = useState<'idle' | 'fading-out' | 'fading-in'>(
    'idle',
  )

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
  const mapMediaClassName = `map-plan__media${
    transitionState === 'fading-out'
      ? ' is-fading-out'
      : transitionState === 'fading-in'
        ? ' is-fading-in'
        : ''
  }`

  const handleFloorClick = (floorId: VendorMapFloorId) => {
    if (floorId === selectedFloor) return
    setSelectedFloor(floorId)
  }

  return (
    <section data-section="vendor-map">
      <div className="map" ref={viewportRef}>
        <div className="map-plan" ref={stageRef}>
          <div className={mapMediaClassName}>
            <RenderMedia
              key={displayedFloorData.mapSrc}
              src={displayedFloorData.mapSrc}
              alt={displayedFloorData.mapAlt}
            />
          </div>
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
