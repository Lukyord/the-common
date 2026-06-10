export const VENDOR_MAP_BRANCH_SLUGS = ['thonglor', 'saladaeng', 'cloud-11'] as const

export type VendorMapBranchSlug = (typeof VENDOR_MAP_BRANCH_SLUGS)[number]

export type VendorMapFloorId = string

export type VendorMapFloor = {
  id: VendorMapFloorId
  label: string
  mapSrc: string
  mapAlt: string
}

export type VendorMapBranchInfo = {
  title: string
  description: string
}

export type VendorMapBranchConfig = {
  slug: VendorMapBranchSlug
  name: string
  defaultFloor: VendorMapFloorId
  floors: VendorMapFloor[]
  info: VendorMapBranchInfo
}

export const VENDOR_MAP_DATA: Record<VendorMapBranchSlug, VendorMapBranchConfig> = {
  thonglor: {
    slug: 'thonglor',
    name: 'Thonglor',
    defaultFloor: 'm',
    floors: [
      {
        id: 'm',
        label: 'M',
        mapSrc: '/map/tl/mf/TL-MF-outline.svg',
        mapAlt: 'Thonglor M Floor Map Plan',
      },
      {
        id: '1',
        label: '1',
        mapSrc: '/map/tl/1f/TL-1F-outline.svg',
        mapAlt: 'Thonglor Floor 1 Map Plan',
      },
      {
        id: '2',
        label: '2',
        mapSrc: '/map/tl/2f/TL-2F-outline.svg',
        mapAlt: 'Thonglor Floor 2 Map Plan',
      },
      {
        id: '3',
        label: '3',
        mapSrc: '/map/tl/3f/TL-3F-outline.svg',
        mapAlt: 'Thonglor Floor 3 Map Plan',
      },
    ],
    info: {
      title: 'Thonglor',
      description: 'Select a floor to explore vendors at Thonglor.',
    },
  },
  saladaeng: {
    slug: 'saladaeng',
    name: 'Saladaeng',
    defaultFloor: 'g',
    floors: [
      {
        id: 'g',
        label: 'G',
        mapSrc: '/map/sd/gf/SD-GF-outline.svg',
        mapAlt: 'Saladaeng Ground Floor Map Plan',
      },
      {
        id: '1',
        label: '1',
        mapSrc: '/map/sd/1f/SD-1F-outline.svg',
        mapAlt: 'Saladaeng Floor 1 Map Plan',
      },
      {
        id: '2',
        label: '2',
        mapSrc: '/map/sd/2f/SD-2F-outline.svg',
        mapAlt: 'Saladaeng Floor 2 Map Plan',
      },
    ],
    info: {
      title: 'Saladaeng',
      description: 'Select a floor to explore vendors at Saladaeng.',
    },
  },
  'cloud-11': {
    slug: 'cloud-11',
    name: 'Cloud 11',
    defaultFloor: 'l',
    floors: [
      {
        id: 'l',
        label: 'L',
        mapSrc: '/map/c11/lf/C11-LF-outline.svg',
        mapAlt: 'Cloud 11 Lobby Floor Map Plan',
      },
      {
        id: '1',
        label: '1',
        mapSrc: '/map/c11/1f/C11-1F-outline.svg',
        mapAlt: 'Cloud 11 Floor 1 Map Plan',
      },
      {
        id: '2',
        label: '2',
        mapSrc: '/map/c11/2f/C11-2F-outline.svg',
        mapAlt: 'Cloud 11 Floor 2 Map Plan',
      },
      {
        id: '3',
        label: '3',
        mapSrc: '/map/c11/3f/C11-3F-outline.svg',
        mapAlt: 'Cloud 11 Floor 3 Map Plan',
      },
      {
        id: '4',
        label: '4',
        mapSrc: '/map/c11/4f/C11-4F-outline.svg',
        mapAlt: 'Cloud 11 Floor 4 Map Plan',
      },
    ],
    info: {
      title: 'Cloud 11',
      description: 'Select a floor to explore vendors at Cloud 11.',
    },
  },
}

export function isVendorMapBranchSlug(slug: string): slug is VendorMapBranchSlug {
  return VENDOR_MAP_BRANCH_SLUGS.includes(slug as VendorMapBranchSlug)
}

export function getVendorMapConfig(branchSlug: string): VendorMapBranchConfig | null {
  if (!isVendorMapBranchSlug(branchSlug)) return null
  return VENDOR_MAP_DATA[branchSlug]
}

export function getVendorMapFloor(
  config: VendorMapBranchConfig,
  floorId: VendorMapFloorId,
): VendorMapFloor {
  return config.floors.find((floor) => floor.id === floorId) ?? config.floors[0]
}

export function getVendorMapDefaultFloorId(config: VendorMapBranchConfig): VendorMapFloorId {
  return config.floors.some((floor) => floor.id === config.defaultFloor)
    ? config.defaultFloor
    : config.floors[0].id
}
