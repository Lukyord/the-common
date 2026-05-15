import type { CollectionConfig } from 'payload'

export const BranchContactPages: CollectionConfig = {
  slug: 'branch-contact-pages',
  labels: {
    singular: 'Branch Contact Page',
    plural: 'Branch Contact Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'branch'],
    group: 'Branches',
    description: 'Contact page per branch.',
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
