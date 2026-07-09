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
        vendors: Array.from({ length: 21 }, (_, index) => ({ lotNumber: index + 1 })),
      },
      {
        id: '1',
        label: '1',
        mapSrc: '/map/tl/1f/TL-1F-outline.svg',
        mapAlt: 'Thonglor Floor 1 Map Plan',
        vendors: Array.from({ length: 12 }, (_, index) => ({ lotNumber: index + 1 })),
      },
      {
        id: '2',
        label: '2',
        mapSrc: '/map/tl/2f/TL-2F-outline.svg',
        mapAlt: 'Thonglor Floor 2 Map Plan',
        vendors: Array.from({ length: 2 }, (_, index) => ({ lotNumber: index + 1 })),
      },
      {
        id: '3',
        label: '3',
        mapSrc: '/map/tl/3f/TL-3F-outline.svg',
        mapAlt: 'Thonglor Floor 3 Map Plan',
        vendors: Array.from({ length: 1 }, (_, index) => ({ lotNumber: index + 1 })),
      },
    ],
  },
  saladaeng: {
    slug: 'saladaeng',
    name: 'Saladaeng',
    defaultFloor: '1',
    floors: [
      {
        id: '1',
        label: '1',
        mapSrc: '/map/sl/1f/SD-1F-outline.svg',
        mapAlt: 'Saladaeng Floor 1 Map Plan',
        vendors: Array.from({ length: 4 }, (_, index) => ({ lotNumber: index + 1 })),
      },
      {
        id: '2',
        label: '2',
        mapSrc: '/map/sl/2f/SD-2F-outline.svg',
        mapAlt: 'Saladaeng Floor 2 Map Plan',
        vendors: Array.from({ length: 17 }, (_, index) => ({ lotNumber: index + 1 })),
      },
      {
        id: '3',
        label: '3',
        mapSrc: '/map/sl/3f/SD-3F-outline.svg',
        mapAlt: 'Saladaeng Floor 3 Map Plan',
        vendors: Array.from({ length: 2 }, (_, index) => ({ lotNumber: index + 1 })),
      },
    ],
  },
  'cloud-11': {
    slug: 'cloud-11',
    name: 'Cloud11',
    defaultFloor: '1',
    floors: [
      {
        id: '4',
        label: '4',
        mapSrc: '/map/c11/4-gs/CL11-GS-outline.svg',
        mapAlt: 'Cloud11 Grand Stand Map Plan',
        vendors: Array.from({ length: 4 }, (_, index) => ({ lotNumber: index + 1 })),
      },
      {
        id: '3',
        label: '3',
        mapSrc: '/map/c11/3-mk/CL11-MK-outline.svg',
        mapAlt: 'Cloud11 Commons Market Map Plan',
        vendors: Array.from({ length: 23 }, (_, index) => ({ lotNumber: index + 1 })),
      },
      {
        id: '2',
        label: '2',
        mapSrc: '/map/c11/2-py/CL11-PY-outline.svg',
        mapAlt: 'Cloud11 Play Yard Map Plan',
        vendors: Array.from({ length: 2 }, (_, index) => ({ lotNumber: index + 1 })),
      },
      {
        id: '1',
        label: '1',
        mapSrc: '/map/c11/1-gw/CL11-GW-outline.svg',
        mapAlt: 'Cloud11 Ground Work Map Plan',
        vendors: Array.from({ length: 4 }, (_, index) => ({ lotNumber: index + 1 })),
      },
    ],
  },
}
