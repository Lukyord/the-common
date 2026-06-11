import type { VendorMapFloorId } from '@/constants/vendorMapData/index'
import type { VendorMapListItem } from '@/components/branch/vendors/types'
import type { Branch } from '@/payload-types'

export type TransitionState = 'idle' | 'fading-out' | 'fading-in'

export type StoreTarget = {
  lot: number
  floor: VendorMapFloorId
}

export type VendorMapProps = {
  branchSlug: string
  floors?: Branch['floors']
  defaultMapTileColor?: string | null
  activeMapTileColor?: string | null
  pinColor?: string | null
  mapVendors?: VendorMapListItem[]
  branchTheme?: {
    bgColor?: string | null
    primaryColor?: string | null
  }
}

export function isSameStoreTarget(a: StoreTarget | null, b: StoreTarget | null) {
  return a?.lot === b?.lot && a?.floor === b?.floor
}

export function withTransitionClassName(base: string, transitionState: TransitionState, extra?: string) {
  return [
    base,
    extra,
    transitionState === 'fading-out' && 'is-fading-out',
    transitionState === 'fading-in' && 'is-fading-in',
  ]
    .filter(Boolean)
    .join(' ')
}

export function getBranchFloorById(
  floors: Branch['floors'] | undefined,
  floorId: VendorMapFloorId,
) {
  return floors?.find((floor) => floor.floorId === floorId) ?? null
}
