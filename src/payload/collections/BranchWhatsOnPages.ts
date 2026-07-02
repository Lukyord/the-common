import type { CollectionConfig, Field } from 'payload'

import { updatePageSaveButtonCollection } from '@/payload/shared/updatePageSaveButton'

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

function section(label: string, fields: Field[]): Field {
  return {
    type: 'collapsible',
    label,
    admin: {
      initCollapsed: true,
    },
    fields,
  }
}

export const BranchWhatsOnPages: CollectionConfig = {
  slug: 'branch-whats-on-pages',
  labels: {
    singular: "Branch What's On Page",
    plural: "Branch What's On Pages",
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'branch'],
    group: 'Branches',
    description: "What's On page per branch.",
    ...updatePageSaveButtonCollection,
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
    section('Landing', [
      {
        name: 'landing',
        type: 'group',
        label: 'Landing',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
          },
          {
            name: 'cards',
            type: 'array',
            label: 'Cards',
            fields: [
              colorPickerField('background', 'Background'),
              colorPickerField('color', 'Text Color'),
              {
                name: 'pattern',
                type: 'select',
                label: 'Pattern',
                options: [
                  { label: 'Zig-zag', value: 'zig-zag' },
                  { label: 'Pill', value: 'pill' },
                ],
              },
              {
                name: 'front',
                type: 'group',
                label: 'Front',
                fields: [
                  {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                  },
                ],
              },
              {
                name: 'back',
                type: 'group',
                label: 'Back',
                fields: [
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
                ],
              },
            ],
          },
        ],
      },
    ]),
    section('Latest', [
      {
        name: 'latest',
        type: 'group',
        label: 'Latest',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
          },
          colorPickerField('background', 'Background'),
          colorPickerField('allBranchesBackground', 'All Branches Background'),
          colorPickerField('allBranchesTextColor', 'All Branches Text Color'),
        ],
      },
    ]),
    section('Daily Live Music', [
      {
        name: 'dailyLiveMusic',
        type: 'group',
        label: 'Daily Live Music',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
          },
          {
            name: 'images',
            type: 'upload',
            relationTo: 'media',
            label: 'Images',
            hasMany: true,
            admin: {
              className: 'upload-field--aspect-0-8',
              description: 'Recommended aspect ratio: 0.8 (4 / 5)',
            },
          },
        ],
      },
    ]),
    section('Club', [
      {
        name: 'club',
        type: 'group',
        label: 'Club',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
          },
          {
            name: 'mainTag',
            type: 'relationship',
            relationTo: 'whats-on-main-tags',
            label: 'Main Tag',
          },
        ],
      },
    ]),
    section('All Events and Workshops', [
      {
        name: 'allEventsAndWorkshops',
        type: 'group',
        label: 'All Events and Workshops',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
          },
          {
            name: 'mainTag',
            type: 'relationship',
            relationTo: 'whats-on-main-tags',
            label: 'Main Tag',
            hasMany: true,
          },
          colorPickerField('background', 'Background'),
          colorPickerField('eventArchiveBackground', 'Event Archive Background'),
          colorPickerField('eventArchiveTextColor', 'Event Archive Text Color'),
        ],
      },
    ]),
  ],
}
