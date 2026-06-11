import type { FloorAmenities, VendorMapBranchSlug, VendorMapFloorId } from '../types'
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
}
