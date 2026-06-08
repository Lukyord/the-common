import type { CollectionConfig, Field, Validate } from 'payload'

import { WHATS_ON_BRANCH_LOCATION_FIELDS } from '@/constants/whatsOnBranchLocations'
import { syncWhatsOnDateFromSchedule } from '@/payload/hooks/whatsOnEventSchedule'

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
  hooks: {
    beforeChange: [syncWhatsOnDateFromSchedule],
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
      maxDepth: 1,
    },
    {
      name: 'branchLocations',
      type: 'group',
      label: 'Branch Locations',
      admin: {
        hideGutter: true,
        condition: (data) => Array.isArray(data?.branch) && data.branch.length > 0,
        description: 'Set the location for each selected branch.',
        components: {
          Field: '@/components/payload/whats-on-branch-locations-field#WhatsOnBranchLocationsField',
        },
      },
      fields: [
        ...WHATS_ON_BRANCH_LOCATION_FIELDS.map(({ name, label }) => ({
          name,
          type: 'text' as const,
          label,
        })),
      ],
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
        description: 'Recommended aspect ratio: 4 / 5',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      label: 'Gallery',
      hasMany: true,
      maxRows: 5,
    },
    colorPickerField('bgColor', 'Bg Color'),
    {
      name: 'eventSchedule',
      type: 'group',
      label: 'Event Schedule',
      admin: {
        description:
          'Pick dates for filtering and display. Patterns: single, range, multiple dates, multiple date ranges (e.g. Thu 21 – Sat 23 Sep 26, Mon 28 – Wed 30 Sep 26).',
      },
      fields: [
        {
          name: 'pattern',
          type: 'select',
          label: 'Date Pattern',
          defaultValue: 'single',
          required: true,
          options: [
            { label: 'Single date', value: 'single' },
            { label: 'Date range', value: 'range' },
            { label: 'Multiple dates', value: 'multiple' },
            { label: 'Multiple date ranges', value: 'multiple-range' },
          ],
        },
        {
          name: 'date',
          type: 'date',
          label: 'Date',
          required: true,
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            condition: (_, siblingData) => siblingData?.pattern === 'single',
          },
        },
        {
          name: 'startDate',
          type: 'date',
          label: 'Start Date',
          required: true,
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            condition: (_, siblingData) => siblingData?.pattern === 'range',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'End Date',
          required: true,
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            condition: (_, siblingData) => siblingData?.pattern === 'range',
          },
        },
        {
          name: 'dates',
          type: 'array',
          label: 'Dates',
          minRows: 1,
          admin: {
            condition: (_, siblingData) => siblingData?.pattern === 'multiple',
          },
          fields: [
            {
              name: 'date',
              type: 'date',
              label: 'Date',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayOnly' },
              },
            },
          ],
        },
        {
          name: 'ranges',
          type: 'array',
          label: 'Date Ranges',
          minRows: 1,
          admin: {
            condition: (_, siblingData) => siblingData?.pattern === 'multiple-range',
          },
          fields: [
            {
              name: 'startDate',
              type: 'date',
              label: 'Start Date',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayOnly' },
              },
            },
            {
              name: 'endDate',
              type: 'date',
              label: 'End Date',
              required: true,
              admin: {
                date: { pickerAppearance: 'dayOnly' },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'date',
      type: 'text',
      label: 'Date Display',
      admin: {
        description: 'Auto-generated from Event Schedule on save.',
      },
    },
    {
      name: 'time',
      type: 'text',
      label: 'Time',
    },
    {
      name: 'mainTag',
      type: 'relationship',
      relationTo: 'whats-on-main-tags',
      label: 'Main Tag',
    },
    {
      name: 'subTags',
      type: 'relationship',
      relationTo: 'whats-on-sub-tags',
      label: 'Sub Tag',
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
