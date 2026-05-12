import type { CollectionConfig } from 'payload'

export const Lifestyle: CollectionConfig = {
  slug: 'lifestyle',
  admin: {
    useAsTitle: 'text',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'text',
      type: 'text',
      label: 'Text',
      required: true,
    },
  ],
}
