import type { FloorLots, VendorMapBranchSlug, VendorMapFloorId } from '../types'
import { thonglorMFloorLots } from './thonglor/m'

export const VENDOR_MAP_FLOOR_LOTS: Partial<
  Record<VendorMapBranchSlug, Partial<Record<VendorMapFloorId, FloorLots>>>
> = {
  thonglor: {
    m: thonglorMFloorLots,
  },
}
