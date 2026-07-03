import type { FloorMapOnlyLots } from '@/constants/vendorMapData/index'
import type { VendorMapFloorId } from '@/constants/vendorMapData/index'
import type { VendorMapListItem } from '@/components/branch/vendors/types'
import { useEffect, useMemo, useState, type RefObject } from 'react'

import { FADE_IN_DURATION_MS, FADE_OUT_DURATION_MS } from '../lib/constants'
import { scrollToElement } from '@/utils/functions/scrollTo'
import { preloadVendorMapImage } from './useVendorMapImagePreload'
import { isSameStoreTarget, type StoreTarget, type TransitionState } from '../lib/shared'
import { getMapOnlyLotStoreInfoItem, getVendorByLot } from '../lib/utils'

type UseStoreSelectionOptions = {
  branchSlug: string
  mapVendors: VendorMapListItem[]
  displayedFloor: VendorMapFloorId
  floorMapOnlyLots: FloorMapOnlyLots | null
  isMobile: boolean
  sectionRef: RefObject<HTMLElement | null>
}

export function useStoreSelection({
  branchSlug,
  mapVendors,
  displayedFloor,
  floorMapOnlyLots,
  isMobile,
  sectionRef,
}: UseStoreSelectionOptions) {
  const [hoveredStore, setHoveredStore] = useState<StoreTarget | null>(null)
  const [displayedStore, setDisplayedStore] = useState<StoreTarget | null>(null)
  const [storeTransitionState, setStoreTransitionState] = useState<TransitionState>('idle')
  const [persistedStoreInfoVendor, setPersistedStoreInfoVendor] = useState<
    VendorMapListItem | undefined
  >()

  useEffect(() => {
    setHoveredStore(null)
    setDisplayedStore(null)
    setStoreTransitionState('idle')
    setPersistedStoreInfoVendor(undefined)
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

  const displayedStoreVendor = useMemo(() => {
    if (!displayedStore) return undefined

    if (displayedStore.mapKey) {
      return getMapOnlyLotStoreInfoItem(
        floorMapOnlyLots,
        displayedStore.mapKey,
        displayedStore.floor,
        branchSlug,
      )
    }

    if (displayedStore.lot != null) {
      return getVendorByLot(mapVendors, displayedStore.floor, displayedStore.lot)
    }

    return undefined
  }, [displayedStore, branchSlug, floorMapOnlyLots, mapVendors])
  const storeInfoVendor = displayedStoreVendor
  const isStoreInfoHidden = !isMobile && !storeInfoVendor

  const storeInfoVendorKey = storeInfoVendor
    ? `${storeInfoVendor.floor}:${storeInfoVendor.link}:${storeInfoVendor.name}`
    : null

  useEffect(() => {
    if (!storeInfoVendor) {
      setPersistedStoreInfoVendor(undefined)
      return
    }

    setPersistedStoreInfoVendor((current) => {
      if (
        current?.floor === storeInfoVendor.floor &&
        current.link === storeInfoVendor.link &&
        current.name === storeInfoVendor.name &&
        current.lotNumber === storeInfoVendor.lotNumber &&
        current.lotLabel === storeInfoVendor.lotLabel &&
        current.openingHoursHtml === storeInfoVendor.openingHoursHtml
      ) {
        return current
      }

      return storeInfoVendor
    })
  }, [storeInfoVendorKey, storeInfoVendor])

  const selectStore = (lotNumber: number, floor: VendorMapFloorId) => {
    const vendor = getVendorByLot(mapVendors, floor, lotNumber)
    if (!vendor?.name) return
    setHoveredStore({ lot: lotNumber, floor })
  }

  const selectMapOnlyLot = (mapKey: string, floor: VendorMapFloorId) => {
    const vendor = getMapOnlyLotStoreInfoItem(floorMapOnlyLots, mapKey, floor, branchSlug)
    if (!vendor?.name) return
    setHoveredStore({ mapKey, floor })
  }

  const hoverStore = (lotNumber: number, floor: VendorMapFloorId) => {
    if (isMobile) return
    preloadVendorMapImage(getVendorByLot(mapVendors, floor, lotNumber)?.media?.src)
    selectStore(lotNumber, floor)
  }

  const hoverMapOnlyLot = (mapKey: string, floor: VendorMapFloorId) => {
    if (isMobile) return
    preloadVendorMapImage(
      getMapOnlyLotStoreInfoItem(floorMapOnlyLots, mapKey, floor, branchSlug)?.media?.src,
    )
    selectMapOnlyLot(mapKey, floor)
  }

  const selectMobileVendor = (lotNumber: number) => {
    selectStore(lotNumber, displayedFloor)
    if (sectionRef.current) scrollToElement(sectionRef.current)
  }

  const selectMobileMapOnlyLot = (mapKey: string) => {
    selectMapOnlyLot(mapKey, displayedFloor)
    if (sectionRef.current) scrollToElement(sectionRef.current)
  }

  const clearStore = () => {
    setHoveredStore(null)
  }

  const storeInfoClassName = [
    'store-info',
    'map-plan-interactive',
    isStoreInfoHidden && 'is-hidden',
    !isStoreInfoHidden &&
      storeInfoVendor &&
      storeTransitionState === 'fading-out' &&
      'is-fading-out',
    !isStoreInfoHidden &&
      storeInfoVendor &&
      storeTransitionState === 'fading-in' &&
      'is-fading-in',
    !isStoreInfoHidden &&
      storeInfoVendor &&
      storeTransitionState === 'idle' &&
      'is-visible',
  ]
    .filter(Boolean)
    .join(' ')

  const selectedStore = hoveredStore ?? displayedStore
  const selectedLotNumber =
    selectedStore?.floor === displayedFloor && selectedStore.lot != null
      ? selectedStore.lot
      : undefined
  const selectedMapKey =
    selectedStore?.floor === displayedFloor && selectedStore.mapKey != null
      ? selectedStore.mapKey
      : undefined

  return {
    storeInfoVendor,
    persistedStoreInfoVendor,
    storeInfoClassName,
    selectedLotNumber,
    selectedMapKey,
    selectStore,
    hoverStore,
    selectMapOnlyLot,
    hoverMapOnlyLot,
    selectMobileVendor,
    selectMobileMapOnlyLot,
    clearStore,
  }
}
