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
        ],
      },
    ]),
  ],
}
