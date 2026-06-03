import type { CollectionConfig } from 'payload'

export const WhatsOnMainTags: CollectionConfig = {
  slug: 'whats-on-main-tags',
  labels: {
    singular: "What's On Main Tag",
    plural: "What's On Main Tags",
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
