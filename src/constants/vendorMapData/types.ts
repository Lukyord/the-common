export const VENDOR_MAP_BRANCH_SLUGS = ['thonglor', 'saladaeng', 'cloud-11'] as const

export type VendorMapBranchSlug = (typeof VENDOR_MAP_BRANCH_SLUGS)[number]

export type VendorMapFloorId = string

export type VendorMapFloor = {
  id: VendorMapFloorId
  label: string
  mapSrc: string
  mapAlt: string
  title?: string
  description?: string
  vendors?: MapVendor[]
}

export type MapVendor = {
  lotNumber: number
}

export type VendorMapBranchConfig = {
  slug: VendorMapBranchSlug
  name: string
  defaultFloor: VendorMapFloorId
  floors: VendorMapFloor[]
}

export type LotLayout = {
  top: string
  left: string
}

export type LotDefinition = {
  viewBox: string
  shapePath: string
  labelPath: string
  layout?: LotLayout
}

export type MapOnlyLotStoreInfo = {
  name: string
  openingHoursHtml?: string
  media?: {
    src: string
    alt: string
  }
  lotLabel?: string
}

export type MapOnlyLotDefinition = LotDefinition & {
  storeInfo?: MapOnlyLotStoreInfo
}

export type FloorLots = Record<number, LotDefinition>

export type FloorMapOnlyLots = Record<string, MapOnlyLotDefinition>

export const AMENITY_IDS = [
  'book',
  'bike',
  'toilet',
  'recycling',
  'family',
  'water',
  'locker-room',
  'music',
  'meeting-room',
  'diaper-changing',
  'photobooth',
  'plant',
  'pet-toilet',
  'pet-wash',
] as const

export type AmenityId = (typeof AMENITY_IDS)[number]

export type AmenityPin = LotLayout

export type FloorAmenity = {
  id: AmenityId
  label: string
  pins: AmenityPin[]
}

export type FloorAmenities = FloorAmenity[]
