import type { FloorAmenities, VendorMapBranchSlug, VendorMapFloorId } from '../types'
import { cloud111FloorAmenities } from './cloud-11/1'
import { cloud112FloorAmenities } from './cloud-11/2'
import { cloud113FloorAmenities } from './cloud-11/3'
import { cloud114FloorAmenities } from './cloud-11/4'
import { saladaeng1FloorAmenities } from './saladaeng/1'
import { saladaeng2FloorAmenities } from './saladaeng/2'
import { saladaeng3FloorAmenities } from './saladaeng/3'
import { thonglor1FloorAmenities } from './thonglor/1'
import { thonglor2FloorAmenities } from './thonglor/2'
import { thonglor3FloorAmenities } from './thonglor/3'
import { thonglorMFloorAmenities } from './thonglor/m'

export const VENDOR_MAP_FLOOR_AMENITIES: Partial<
  Record<VendorMapBranchSlug, Partial<Record<VendorMapFloorId, FloorAmenities>>>
> = {
  thonglor: {
    m: thonglorMFloorAmenities,
    '1': thonglor1FloorAmenities,
    '2': thonglor2FloorAmenities,
    '3': thonglor3FloorAmenities,
  },
  saladaeng: {
    '1': saladaeng1FloorAmenities,
    '2': saladaeng2FloorAmenities,
    '3': saladaeng3FloorAmenities,
  },
  'cloud-11': {
    '1': cloud111FloorAmenities,
    '2': cloud112FloorAmenities,
    '3': cloud113FloorAmenities,
    '4': cloud114FloorAmenities,
  },
}
