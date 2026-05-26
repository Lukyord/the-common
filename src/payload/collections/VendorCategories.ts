import type { CollectionConfig } from 'payload'

export const VendorCategories: CollectionConfig = {
  slug: 'vendor-categories',
  labels: {
    singular: 'Vendor Category',
    plural: 'Vendor Categories',
  },
  admin: {
    useAsTitle: 'text',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      label: 'Text',
      required: true,
    },
  ],
}
