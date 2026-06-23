import type { CollectionConfig } from 'payload'

import { updatePageSaveButtonCollection } from '@/payload/shared/updatePageSaveButton'

export const BranchSpaceRentalPages: CollectionConfig = {
  slug: 'branch-venue-rental-pages',
  labels: {
    singular: 'Branch Venue Rental Page',
    plural: 'Branch Venue Rental Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'branch'],
    group: 'Branches',
    description: 'Venue rental page per branch.',
    ...updatePageSaveButtonCollection,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
      unique: true,
      index: true,
    },
  ],
}
