import type { AmenityId } from '@/constants/vendorMapData/index'
import type { VendorMapFloorId } from '@/constants/vendorMapData/index'
import { useEffect, useState, type RefObject } from 'react'

import { FADE_IN_DURATION_MS, FADE_OUT_DURATION_MS } from '../lib/constants'
import { scrollToElement } from '@/utils/functions/scrollTo'
import type { TransitionState } from '../lib/shared'

type UseAmenitySelectionOptions = {
  displayedFloor: VendorMapFloorId
  isMobile: boolean
  sectionRef: RefObject<HTMLElement | null>
}

export function useAmenitySelection({
  displayedFloor,
  isMobile,
  sectionRef,
}: UseAmenitySelectionOptions) {
  const [hoveredAmenityId, setHoveredAmenityId] = useState<AmenityId | null>(null)
  const [displayedAmenityId, setDisplayedAmenityId] = useState<AmenityId | null>()
  const [amenityTransitionState, setAmenityTransitionState] = useState<TransitionState>('idle')

  useEffect(() => {
    setHoveredAmenityId(null)
    setDisplayedAmenityId(null)
    setAmenityTransitionState('idle')
  }, [displayedFloor])

  useEffect(() => {
    if (amenityTransitionState !== 'idle' || hoveredAmenityId === displayedAmenityId) return

    if (displayedAmenityId != null) {
      setAmenityTransitionState('fading-out')
      return
    }

    setDisplayedAmenityId(hoveredAmenityId)
    if (hoveredAmenityId != null) {
      setAmenityTransitionState('fading-in')
    }
  }, [hoveredAmenityId, displayedAmenityId, amenityTransitionState])

  useEffect(() => {
    if (amenityTransitionState === 'fading-out') {
      const timeout = window.setTimeout(() => {
        setDisplayedAmenityId(hoveredAmenityId)
        setAmenityTransitionState(hoveredAmenityId != null ? 'fading-in' : 'idle')
      }, FADE_OUT_DURATION_MS)
      return () => window.clearTimeout(timeout)
    }

    if (amenityTransitionState === 'fading-in') {
      const timeout = window.setTimeout(() => {
        setAmenityTransitionState(hoveredAmenityId !== displayedAmenityId ? 'fading-out' : 'idle')
      }, FADE_IN_DURATION_MS)
      return () => window.clearTimeout(timeout)
    }

    return undefined
  }, [amenityTransitionState, hoveredAmenityId, displayedAmenityId])

  const hoverAmenity = (amenityId: AmenityId) => {
    if (isMobile) return
    setHoveredAmenityId(amenityId)
  }

  const clearAmenity = () => {
    setHoveredAmenityId(null)
  }

  const selectMobileAmenity = (amenityId: AmenityId) => {
    setHoveredAmenityId(amenityId)
    if (sectionRef.current) scrollToElement(sectionRef.current)
  }

  const amenityPinsClassName = [
    'map-pins',
    displayedAmenityId && amenityTransitionState === 'fading-out' && 'is-fading-out',
    displayedAmenityId && amenityTransitionState === 'fading-in' && 'is-fading-in',
    displayedAmenityId && amenityTransitionState === 'idle' && 'is-visible',
  ]
    .filter(Boolean)
    .join(' ')

  return {
    displayedAmenityId,
    hoverAmenity,
    clearAmenity,
    selectMobileAmenity,
    amenityPinsClassName,
  }
}
