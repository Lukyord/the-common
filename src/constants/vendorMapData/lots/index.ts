import type { FloorLots, FloorMapOnlyLots, VendorMapBranchSlug, VendorMapFloorId } from '../types'
import { cloud111FloorLots } from './cloud-11/1'
import { cloud112FloorLots } from './cloud-11/2'
import { cloud113FloorLots } from './cloud-11/3'
import { cloud114FloorLots } from './cloud-11/4'
import { saladaeng1FloorLots } from './saladaeng/1'
import { saladaeng2FloorLots } from './saladaeng/2'
import { saladaeng3FloorLots } from './saladaeng/3'
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
  saladaeng: {
    '1': saladaeng1FloorLots,
    '2': saladaeng2FloorLots,
    '3': saladaeng3FloorLots,
  },
  'cloud-11': {
    '1': cloud111FloorLots,
    '2': cloud112FloorLots,
    '3': cloud113FloorLots,
    '4': cloud114FloorLots,
  },
}

export const VENDOR_MAP_FLOOR_MAP_ONLY_LOTS: Partial<
  Record<VendorMapBranchSlug, Partial<Record<VendorMapFloorId, FloorMapOnlyLots>>>
> = {
  thonglor: {
    '3': thonglor3FloorMapOnlyLots,
  },
}
