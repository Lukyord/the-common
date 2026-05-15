import type { CollectionConfig } from 'payload'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  labels: {
    singular: 'Vendor',
    plural: 'Vendors',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'branch'],
    group: 'Branches',
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
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
      index: true,
    },
  ],
}
