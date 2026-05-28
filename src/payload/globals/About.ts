import type { Field, GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About',
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
                    name: 'title',
                    type: 'text',
                    label: 'Title',
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
            ]),
            section('Info', [
              {
                name: 'info',
                type: 'array',
                label: 'Info',
                fields: [
                  {
                    name: 'hexCode',
                    type: 'text',
                    label: 'Hex Code',
                    admin: {
                      components: {
                        Field: {
                          path: '@/components/payload/color-picker-field',
                          exportName: 'ColorPickerField',
                        },
                      },
                    },
                  },
                  {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                  },
                  {
                    name: 'richTextEditor',
                    type: 'richText',
                    label: 'Rich Text Editor',
                  },
                  {
                    name: 'media',
                    type: 'upload',
                    relationTo: 'media',
                    label: 'Media',
                  },
                ],
              },
            ]),
            section('Awards', [
              {
                name: 'awards',
                type: 'group',
                label: 'Awards',
                admin: {
                  hideGutter: true,
                },
                fields: [
                  {
                    name: 'mediaWithLink',
                    type: 'array',
                    label: 'Media With Link',
                    fields: [
                      {
                        name: 'media',
                        type: 'upload',
                        relationTo: 'media',
                        label: 'Media',
                      },
                    ],
                  },
                  {
                    name: 'media',
                    type: 'array',
                    label: 'Media',
                    fields: [
                      {
                        name: 'media',
                        type: 'upload',
                        relationTo: 'media',
                        label: 'Media',
                      },
                    ],
                  },
                ],
              },
            ]),
            section('Kinnest Marquee', [
              {
                name: 'kinnestMarquee',
                type: 'group',
                label: 'Kinnest Marquee',
                admin: {
                  hideGutter: true,
                },
                fields: [
                  {
                    name: 'media',
                    type: 'array',
                    label: 'Media',
                    fields: [
                      {
                        name: 'media',
                        type: 'upload',
                        relationTo: 'media',
                        label: 'Media',
                      },
                    ],
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
