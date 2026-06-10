import type { MapVendor } from '@/constants/vendorMapData/index'
import type { VendorMapListItem } from '@/components/branch/vendors/types'

function vendorHasStoreData(vendor: VendorMapListItem | undefined): vendor is VendorMapListItem {
  return Boolean(vendor?.name)
}

export type FloorVendorListItem = {
  lotNumber: number
  name?: string
  link?: string
  tags: string[]
}

export function buildFloorVendorList(
  mapVendors: MapVendor[],
  cmsVendors: VendorMapListItem[],
  floorId: string,
): FloorVendorListItem[] {
  const cmsByLot = new Map(
    cmsVendors.filter((vendor) => vendor.floor === floorId).map((vendor) => [vendor.lotNumber, vendor]),
  )

  return mapVendors.map(({ lotNumber }) => {
    const cms = cmsByLot.get(lotNumber)

    return {
      lotNumber,
      name: cms?.name,
      link: cms?.link,
      tags: cms?.tags ?? [],
    }
  })
}

export function splitVendorsIntoSlides<T>(vendors: T[]): [T[], T[]] {
  const firstCount = Math.ceil(vendors.length / 2)
  return [vendors.slice(0, firstCount), vendors.slice(firstCount)]
}

export function getVendorByLot(
  cmsVendors: VendorMapListItem[],
  floorId: string,
  lotNumber: number,
): VendorMapListItem | undefined {
  return cmsVendors.find((vendor) => vendor.floor === floorId && vendor.lotNumber === lotNumber)
}

export function getFirstFloorVendorWithData(
  cmsVendors: VendorMapListItem[],
  floorId: string,
  floorVendors: MapVendor[],
): VendorMapListItem | undefined {
  for (const { lotNumber } of floorVendors) {
    const vendor = getVendorByLot(cmsVendors, floorId, lotNumber)
    if (vendorHasStoreData(vendor)) return vendor
  }

  return undefined
}
