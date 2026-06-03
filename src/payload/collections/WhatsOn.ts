import type { CollectionConfig, Field, Validate } from 'payload'
import { whatsOnMainTagSelectOptions, whatsOnSubTagSelectOptions } from '@/constants/whatsOnTags'

const validateSubTags: Validate = (value) => {
  if (!value) return true
  if (!Array.isArray(value)) return true
  return value.length <= 3 || 'You can select up to 3 sub tags.'
}

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

export const WhatsOn: CollectionConfig = {
  slug: 'whats-on',
  labels: {
    singular: "What's On",
    plural: "What's On",
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'branch', 'dateToBeArchived'],
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
      admin: {
        custom: {
          sourceField: 'title',
        },
        components: {
          Field: {
            path: '@/components/payload/generate-slug-field',
            exportName: 'GenerateSlugField',
          },
        },
      },
    },
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      hasMany: true,
      required: true,
      index: true,
    },
    {
      name: 'dateToBeArchived',
      type: 'date',
      label: 'Date to be Archived',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Media',
      admin: {
        className: 'upload-field--aspect-1',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      maxRows: 5,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          label: 'Media',
          required: true,
        },
      ],
    },
    colorPickerField('bgColor', 'Bg Color'),
    {
      name: 'date',
      type: 'text',
      label: 'Date',
    },
    {
      name: 'time',
      type: 'text',
      label: 'Time',
    },
    {
      name: 'mainTag',
      type: 'select',
      label: 'Main Tag',
      options: whatsOnMainTagSelectOptions,
    },
    {
      name: 'subTags',
      type: 'select',
      label: 'Sub Tag',
      options: whatsOnSubTagSelectOptions,
      hasMany: true,
      validate: validateSubTags,
    },
    {
      name: 'highlightText',
      type: 'group',
      label: 'Highlight Text',
      admin: {
        hideGutter: true,
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Highlight Text',
        },
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Button Link',
    },
  ],
}
