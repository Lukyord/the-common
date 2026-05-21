import type { CollectionConfig, Field } from 'payload'

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
    colorPickerField('primaryColor', 'Primary Color'),
    colorPickerField('bgColor', 'Background Color'),
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      admin: {
        hideGutter: true,
      },
      fields: heroFields,
    },
  ],
}
