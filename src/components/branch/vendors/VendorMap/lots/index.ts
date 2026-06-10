import type { VendorMapBranchSlug, VendorMapFloorId } from '@/constants/vendorMapData'

import type { FloorLots } from '../types'
import { thonglorMFloorLots } from './thonglor/m'

const FLOOR_LOTS: Partial<Record<VendorMapBranchSlug, Partial<Record<VendorMapFloorId, FloorLots>>>> =
  {
    thonglor: {
      m: thonglorMFloorLots,
    },
  }

export function getFloorLots(
  branchSlug: string,
  floorId: VendorMapFloorId,
): FloorLots | null {
  const branchLots = FLOOR_LOTS[branchSlug as VendorMapBranchSlug]
  if (!branchLots) return null

  return branchLots[floorId] ?? null
}
