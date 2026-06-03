import type { CollectionConfig } from 'payload'

export const Lifestyle: CollectionConfig = {
  slug: 'lifestyle',
  labels: {
    singular: 'Lifestyle',
    plural: 'Lifestyles',
  },
  admin: {
    useAsTitle: 'text',
    group: 'Miscellaneous',
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
