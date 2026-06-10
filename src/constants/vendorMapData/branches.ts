import type { VendorMapBranchConfig, VendorMapBranchSlug } from './types'

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
        vendors: Array.from({ length: 20 }, (_, index) => ({ lotNumber: index + 1 })),
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
  },
}
