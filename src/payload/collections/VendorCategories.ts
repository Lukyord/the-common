import type { CollectionConfig } from 'payload'

export const VendorCategories: CollectionConfig = {
  slug: 'vendor-categories',
  labels: {
    singular: 'Vendor Category',
    plural: 'Vendor Categories',
  },
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['categoryId', 'text'],
    group: 'Branches',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'categoryId',
      type: 'text',
      label: 'Id',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'text',
      type: 'text',
      label: 'Text',
      required: true,
    },
  ],
}
