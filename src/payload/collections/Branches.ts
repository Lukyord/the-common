import type { CollectionConfig, Field, Validate } from 'payload'

const colorPickerField = (name: string, label: string): Field => ({
  name,
  type: 'text',
  label,
  admin: {
    components: {
      Field: {
        path: '@/components/payload/color-picker-field',
        exportName: 'ColorPickerField',
      },
    },
  },
})

const heroFields: Field[] = [
  {
    name: 'backgroundMedia',
    type: 'upload',
    relationTo: 'media',
    label: 'Background Media',
  },
  {
    name: 'mobileBackgroundMedia',
    type: 'upload',
    relationTo: 'media',
    label: 'Mobile Background Media',
  },
  {
    name: 'title',
    type: 'text',
    label: 'Title',
  },
]

const validateHighlightVendors: Validate = (value) => {
  if (!value) return true

  if (!Array.isArray(value)) return true

  return value.length <= 3 || 'You can select up to 3 highlighted vendors.'
}

export const Branches: CollectionConfig = {
  slug: 'branches',
  labels: {
    singular: 'Branch',
    plural: 'Branches',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Branches',
    description: 'Branch identity and landing page content.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branch Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
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
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Branch Logo',
            },
            {
              name: 'tel',
              type: 'text',
              label: 'Tel',
            },
            {
              name: 'floors',
              type: 'array',
              label: 'Floors',
              fields: [
                {
                  name: 'floorId',
                  type: 'text',
                  label: 'Id',
                  required: true,
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  required: true,
                },
              ],
            },
            colorPickerField('primaryColor', 'Primary Color'),
            colorPickerField('bgColor', 'Background Color'),
            colorPickerField('footerBg', 'Footer BG'),
            colorPickerField('footerColor', 'Footer Color'),
            {
              name: 'findUs',
              type: 'richText',
              label: 'Find Us',
            },
            {
              name: 'openingHours',
              type: 'richText',
              label: 'Opening Hours',
            },
            {
              name: 'parkingOptions',
              type: 'richText',
              label: 'Parking Options',
            },
          ],
        },
        {
          label: 'Branch Landing',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Hero',
              admin: {
                hideGutter: true,
              },
              fields: heroFields,
            },
            {
              name: 'about',
              type: 'group',
              label: 'About',
              fields: [
                colorPickerField('bgColor', 'Background Color'),
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                },
                {
                  name: 'backgroundMedia',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Media',
                },
                {
                  name: 'mobileBackgroundMedia',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Mobile Background Media',
                },
              ],
            },
            {
              name: 'vibesCheck',
              type: 'group',
              label: 'Vibes Check',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },
                colorPickerField('primaryColor', 'Primary Color'),
                colorPickerField('secondaryColor', 'Secondary Color'),
                {
                  name: 'gallery',
                  type: 'array',
                  label: 'Gallery',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Title',
                    },
                    {
                      name: 'day',
                      type: 'group',
                      label: 'Day',
                      fields: [
                        {
                          name: 'media',
                          type: 'upload',
                          relationTo: 'media',
                          label: 'Media',
                        },
                        {
                          name: 'mediaMobile',
                          type: 'upload',
                          relationTo: 'media',
                          label: 'Media Mobile',
                        },
                      ],
                    },
                    {
                      name: 'night',
                      type: 'group',
                      label: 'Night',
                      fields: [
                        {
                          name: 'media',
                          type: 'upload',
                          relationTo: 'media',
                          label: 'Media',
                        },
                        {
                          name: 'mediaMobile',
                          type: 'upload',
                          relationTo: 'media',
                          label: 'Media Mobile',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'vendorsSection',
              type: 'group',
              label: 'Vendors Section',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                },
                {
                  name: 'displayType',
                  type: 'radio',
                  label: 'Branch Display Type',
                  defaultValue: 'latest',
                  options: [
                    {
                      label: 'Latest',
                      value: 'latest',
                    },
                    {
                      label: 'Highlight',
                      value: 'highlight',
                    },
                  ],
                },
                {
                  name: 'highlightVendors',
                  type: 'relationship',
                  relationTo: 'vendors',
                  label: 'Highlight Vendors',
                  hasMany: true,
                  validate: validateHighlightVendors,
                  admin: {
                    condition: (_, siblingData) => siblingData?.displayType === 'highlight',
                    description:
                      'Manually select up to 3 vendors. Only vendors from this branch are shown.',
                  },
                  filterOptions: ({ data }) => {
                    if (!data?.id || typeof data.id !== 'number') {
                      return false
                    }

                    return {
                      branch: {
                        equals: data.id,
                      },
                    }
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
