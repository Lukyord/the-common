import type { VendorMapBranchSlug, VendorMapFloorId } from '@/constants/vendorMapData'

import type { MapVendor } from './types'

export const VENDOR_MAP_FLOOR_VENDORS: Partial<
  Record<VendorMapBranchSlug, Partial<Record<VendorMapFloorId, MapVendor[]>>>
> = {
  thonglor: {
    m: Array.from({ length: 20 }, (_, index) => ({ lotNumber: index + 1 })),
  },
}

export function getFloorVendors(branchSlug: string, floorId: VendorMapFloorId): MapVendor[] {
  const branchVendors = VENDOR_MAP_FLOOR_VENDORS[branchSlug as VendorMapBranchSlug]
  if (!branchVendors) return []

  return branchVendors[floorId] ?? []
}
