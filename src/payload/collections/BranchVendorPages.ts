import type { CollectionConfig } from 'payload'

export const BranchVendorPages: CollectionConfig = {
  slug: 'branch-vendor-pages',
  labels: {
    singular: 'Branch Vendor Page',
    plural: 'Branch Vendor Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['branch', 'title'],
    group: 'Branches',
    description: 'Vendors page per branch.',
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
