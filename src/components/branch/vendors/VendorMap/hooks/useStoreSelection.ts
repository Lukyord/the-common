import type { MapVendor } from '@/constants/vendorMapData/index'
import type { VendorMapFloorId } from '@/constants/vendorMapData/index'
import type { VendorMapListItem } from '@/components/branch/vendors/types'
import { useEffect, useState, type RefObject } from 'react'

import { FADE_IN_DURATION_MS, FADE_OUT_DURATION_MS } from '../lib/constants'
import { isSameStoreTarget, type StoreTarget, type TransitionState } from '../lib/shared'
import { getFirstFloorVendorWithData, getVendorByLot } from '../lib/utils'

type UseStoreSelectionOptions = {
  mapVendors: VendorMapListItem[]
  displayedFloor: VendorMapFloorId
  floorVendors: MapVendor[]
  isMobile: boolean
  sectionRef: RefObject<HTMLElement | null>
}

export function useStoreSelection({
  mapVendors,
  displayedFloor,
  floorVendors,
  isMobile,
  sectionRef,
}: UseStoreSelectionOptions) {
  const [hoveredStore, setHoveredStore] = useState<StoreTarget | null>(null)
  const [displayedStore, setDisplayedStore] = useState<StoreTarget | null>(null)
  const [storeTransitionState, setStoreTransitionState] = useState<TransitionState>('idle')

  useEffect(() => {
    setHoveredStore(null)
    setDisplayedStore(null)
    setStoreTransitionState('idle')
  }, [displayedFloor])

  useEffect(() => {
    if (storeTransitionState !== 'idle' || isSameStoreTarget(hoveredStore, displayedStore)) return

    if (displayedStore != null) {
      setStoreTransitionState('fading-out')
      return
    }

    setDisplayedStore(hoveredStore)
    if (hoveredStore != null) {
      setStoreTransitionState('fading-in')
    }
  }, [hoveredStore, displayedStore, storeTransitionState])

  useEffect(() => {
    if (storeTransitionState === 'fading-out') {
      const timeout = window.setTimeout(() => {
        setDisplayedStore(hoveredStore)
        setStoreTransitionState(hoveredStore != null ? 'fading-in' : 'idle')
      }, FADE_OUT_DURATION_MS)
      return () => window.clearTimeout(timeout)
    }

    if (storeTransitionState === 'fading-in') {
      const timeout = window.setTimeout(() => {
        setStoreTransitionState(
          !isSameStoreTarget(hoveredStore, displayedStore) ? 'fading-out' : 'idle',
        )
      }, FADE_IN_DURATION_MS)
      return () => window.clearTimeout(timeout)
    }

    return undefined
  }, [storeTransitionState, hoveredStore, displayedStore])

  const displayedStoreVendor = displayedStore
    ? getVendorByLot(mapVendors, displayedStore.floor, displayedStore.lot)
    : undefined
  const defaultMobileStoreVendor = getFirstFloorVendorWithData(
    mapVendors,
    displayedFloor,
    floorVendors,
  )
  const storeInfoVendor = isMobile
    ? (displayedStoreVendor ?? defaultMobileStoreVendor)
    : displayedStoreVendor
  const isDefaultMobileStore = isMobile && !displayedStoreVendor && Boolean(defaultMobileStoreVendor)

  const selectStore = (lotNumber: number, floor: VendorMapFloorId) => {
    const vendor = getVendorByLot(mapVendors, floor, lotNumber)
    if (!vendor?.name) return
    setHoveredStore({ lot: lotNumber, floor })
  }

  const hoverStore = (lotNumber: number, floor: VendorMapFloorId) => {
    if (isMobile) return
    selectStore(lotNumber, floor)
  }

  const selectMobileVendor = (lotNumber: number) => {
    selectStore(lotNumber, displayedFloor)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const clearStore = () => {
    setHoveredStore(null)
  }

  const storeInfoClassName = [
    'store-info',
    'map-plan-interactive',
    storeInfoVendor && !isDefaultMobileStore && storeTransitionState === 'fading-out' && 'is-fading-out',
    storeInfoVendor && !isDefaultMobileStore && storeTransitionState === 'fading-in' && 'is-fading-in',
    storeInfoVendor &&
      (isDefaultMobileStore || storeTransitionState === 'idle') &&
      'is-visible',
  ]
    .filter(Boolean)
    .join(' ')

  const selectedStore = hoveredStore ?? displayedStore
  const selectedLotNumber =
    selectedStore?.floor === displayedFloor ? selectedStore.lot : undefined

  return {
    storeInfoVendor,
    storeInfoClassName,
    selectedLotNumber,
    selectStore,
    hoverStore,
    selectMobileVendor,
    clearStore,
  }
}
