import type { ComponentProps } from 'react'

import type { BranchShape } from '@/components/elements/BranchShape'

type Branch = ComponentProps<typeof BranchShape>['branch']

export type LocationMeta = {
  branch: Branch
  slug: string
  href: string
  name: string
  captions: string[]
}

export const LOCATIONS: LocationMeta[] = [
  {
    branch: 'thonglor',
    slug: 'thonglor',
    href: '/thonglor',
    name: 'Thonglor',
    captions: ['OPENING HOURS', '8am - 1am'],
  },
  {
    branch: 'saladaeng',
    slug: 'saladaeng',
    href: '/saladaeng',
    name: 'Saladaeng',
    captions: ['OPENING HOURS', '8am - 1am'],
  },
  {
    branch: 'cloud-11',
    slug: 'cloud-11',
    href: '/cloud-11',
    name: 'Cloud11',
    captions: ['OPENING HOURS', '10am - 12am'],
    // captions: ['Coming soon'],
  },
]

export const LOCATION_BY_SLUG = Object.fromEntries(
  LOCATIONS.map((location) => [location.slug, location]),
) as Record<string, LocationMeta>
