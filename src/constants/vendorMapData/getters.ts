import { VENDOR_MAP_DATA } from './branches'
import { VENDOR_MAP_FLOOR_LOTS } from './lots'
import type {
  FloorLots,
  MapVendor,
  VendorMapBranchConfig,
  VendorMapBranchSlug,
  VendorMapFloor,
  VendorMapFloorId,
} from './types'
import { VENDOR_MAP_BRANCH_SLUGS } from './types'

export function isVendorMapBranchSlug(slug: string): slug is VendorMapBranchSlug {
  return VENDOR_MAP_BRANCH_SLUGS.includes(slug as VendorMapBranchSlug)
}

export function getVendorMapConfig(branchSlug: string): VendorMapBranchConfig | null {
  if (!isVendorMapBranchSlug(branchSlug)) return null
  return VENDOR_MAP_DATA[branchSlug]
}

export function getVendorMapFloor(
  config: VendorMapBranchConfig,
  floorId: VendorMapFloorId,
): VendorMapFloor {
  return config.floors.find((floor) => floor.id === floorId) ?? config.floors[0]
}

export function getVendorMapDefaultFloorId(config: VendorMapBranchConfig): VendorMapFloorId {
  return config.floors.some((floor) => floor.id === config.defaultFloor)
    ? config.defaultFloor
    : config.floors[0].id
}

export function getFloorLots(
  branchSlug: string,
  floorId: VendorMapFloorId,
): FloorLots | null {
  const branchLots = VENDOR_MAP_FLOOR_LOTS[branchSlug as VendorMapBranchSlug]
  if (!branchLots) return null

  return branchLots[floorId] ?? null
}

export function getFloorVendors(branchSlug: string, floorId: VendorMapFloorId): MapVendor[] {
  const config = getVendorMapConfig(branchSlug)
  if (!config) return []

  return config.floors.find((floor) => floor.id === floorId)?.vendors ?? []
}
