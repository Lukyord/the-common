import type { CollectionConfig } from 'payload'

export const WhatsOnSubTags: CollectionConfig = {
  slug: 'whats-on-sub-tags',
  labels: {
    singular: "What's On Sub Tag",
    plural: "What's On Sub Tags",
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
