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

export type FloorLots = Record<number, LotDefinition>
