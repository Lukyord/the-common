import {
  getVendorMapDefaultFloorId,
  type VendorMapBranchConfig,
  type VendorMapFloorId,
} from '@/constants/vendorMapData/index'
import { useEffect, useState, type RefObject } from 'react'

import { FADE_IN_DURATION_MS, FADE_OUT_DURATION_MS } from '../lib/constants'
import { withTransitionClassName, type TransitionState } from '../lib/shared'

type UseFloorTransitionOptions = {
  branchSlug: string
  config: VendorMapBranchConfig
  panzoomRef: RefObject<{ reset: (options?: { animate?: boolean }) => void } | null>
}

export function useFloorTransition({ branchSlug, config, panzoomRef }: UseFloorTransitionOptions) {
  const [selectedFloor, setSelectedFloor] = useState<VendorMapFloorId>(() =>
    getVendorMapDefaultFloorId(config),
  )
  const [displayedFloor, setDisplayedFloor] = useState<VendorMapFloorId>(selectedFloor)
  const [transitionState, setTransitionState] = useState<TransitionState>('idle')

  useEffect(() => {
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

  const selectFloor = (floorId: VendorMapFloorId) => {
    if (floorId === selectedFloor) return
    setSelectedFloor(floorId)
  }

  return {
    selectedFloor,
    displayedFloor,
    transitionState,
    selectFloor,
    mapPlanClassName: withTransitionClassName('map-plan', transitionState),
    infoInnerClassName: withTransitionClassName('info-inner', transitionState, 'c-beige'),
  }
}
