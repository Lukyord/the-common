import type { Field, GlobalConfig } from 'payload'

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

export const WhatsOnPage: GlobalConfig = {
  slug: 'whats-on-page',
  label: "What's On Page",
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            section('Hero', [
              {
                name: 'hero',
                type: 'group',
                label: 'Hero',
                admin: {
                  hideGutter: true,
                },
                fields: [
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
          ],
        },
      ],
    },
  ],
}

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
