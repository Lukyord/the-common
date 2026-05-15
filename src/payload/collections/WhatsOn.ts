import type { CollectionConfig } from 'payload'

export const WhatsOn: CollectionConfig = {
  slug: 'whats-on',
  labels: {
    singular: "What's On",
    plural: "What's On",
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'branch'],
    group: 'Branches',
    description: 'Activities and listings shown on each branch.',
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
