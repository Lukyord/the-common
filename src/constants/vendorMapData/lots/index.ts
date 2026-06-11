import type { FloorLots, FloorMapOnlyLots, VendorMapBranchSlug, VendorMapFloorId } from '../types'
import { thonglor1FloorLots } from './thonglor/1'
import { thonglor2FloorLots } from './thonglor/2'
import { thonglor3FloorLots, thonglor3FloorMapOnlyLots } from './thonglor/3'
import { thonglorMFloorLots } from './thonglor/m'

export const VENDOR_MAP_FLOOR_LOTS: Partial<
  Record<VendorMapBranchSlug, Partial<Record<VendorMapFloorId, FloorLots>>>
> = {
  thonglor: {
    m: thonglorMFloorLots,
    '1': thonglor1FloorLots,
    '2': thonglor2FloorLots,
    '3': thonglor3FloorLots,
  },
}

export const VENDOR_MAP_FLOOR_MAP_ONLY_LOTS: Partial<
  Record<VendorMapBranchSlug, Partial<Record<VendorMapFloorId, FloorMapOnlyLots>>>
> = {
  thonglor: {
    '3': thonglor3FloorMapOnlyLots,
  },
}
