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

const shapeOptions = {
  hexagon: 'Hexagon',
  circle: 'Circle',
  square: 'Square',
}

const announcementFormatOptions = {
  square: 'Square',
  vertical: 'Vertical',
  landscape: 'Landscape',
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
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
            section('Announcement', [
              {
                name: 'announcementShow',
                type: 'checkbox',
                label: 'Show Announcement',
                defaultValue: false,
              },
              {
                name: 'announcement',
                type: 'group',
                label: 'Announcement',
                admin: {
                  hideGutter: true,
                },
                fields: [
                  {
                    name: 'format',
                    type: 'select',
                    label: 'Format',
                    options: Object.entries(announcementFormatOptions).map(([value, label]) => ({
                      label,
                      value,
                    })),
                  },
                  {
                    name: 'media',
                    type: 'upload',
                    relationTo: 'media',
                    label: 'Media',
                  },
                  {
                    name: 'link',
                    type: 'text',
                    label: 'Link',
                  },
                ],
              },
            ]),
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
            section('Motto', [
              {
                name: 'motto',
                type: 'array',
                label: 'Motto',
                fields: [
                  {
                    name: 'text',
                    type: 'textarea',
                    label: 'Text',
                  },
                  {
                    name: 'shape',
                    type: 'select',
                    label: 'Shape',
                    options: Object.entries(shapeOptions).map(([value, label]) => ({
                      label,
                      value,
                    })),
                  },
                ],
              },
            ]),
            section('About', [
              {
                name: 'about',
                type: 'group',
                label: 'About',
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
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                  },
                  {
                    name: 'stickyNotes',
                    type: 'array',
                    label: 'Sticky Notes',
                    minRows: 3,
                    maxRows: 3,
                    fields: [
                      {
                        name: 'media',
                        type: 'upload',
                        relationTo: 'media',
                        label: 'Media',
                        admin: {
                          description: 'Recommended aspect ratio: 1.4326',
                        },
                      },
                      {
                        name: 'shape',
                        type: 'select',
                        label: 'Shape',
                        options: [
                          { label: 'Square', value: 'square' },
                          { label: 'Circle', value: 'circle' },
                          { label: 'Heart', value: 'heart' },
                        ],
                      },
                      {
                        name: 'text',
                        type: 'text',
                        label: 'Text',
                      },
                      colorPickerField('bgColor', 'Background Color'),
                      colorPickerField('textColor', 'Text Color'),
                    ],
                  },
                ],
              },
            ]),
            section('People of theCommons', [
              {
                name: 'peopleOfTheCommons',
                type: 'group',
                label: 'People of theCommons',
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
                      {
                        name: 'media',
                        type: 'upload',
                        relationTo: 'media',
                        label: 'Media',
                      },
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
                        name: 'link',
                        type: 'text',
                        label: 'Link',
                      },
                    ],
                  },
                ],
              },
            ]),
            section('Flexible Section', [
              {
                name: 'flexibleSectionShow',
                type: 'checkbox',
                label: 'Show Flexible Section',
                defaultValue: false,
              },
              {
                name: 'flexibleSection',
                type: 'array',
                label: 'Flexible Section',
                maxRows: 4,
                fields: [
                  {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                  },
                  {
                    name: 'description',
                    type: 'richText',
                    label: 'Description',
                  },
                  colorPickerField('bgColor', 'Background Color'),
                  {
                    name: 'media',
                    type: 'upload',
                    relationTo: 'media',
                    label: 'Media',
                  },
                ],
              },
            ]),
            section('What Are You In The Mood For?', [
              {
                name: 'whatAreYouInTheMoodFor',
                type: 'group',
                label: 'What Are You In The Mood For?',
                admin: {
                  hideGutter: true,
                },
                fields: [
                  {
                    name: 'titleLineOne',
                    type: 'text',
                    label: 'Title Line One',
                  },
                  {
                    name: 'titleLineTwo',
                    type: 'text',
                    label: 'Title Line Two',
                  },
                  {
                    name: 'preSentence',
                    type: 'text',
                    label: 'Pre Sentence',
                  },
                  {
                    name: 'preSentenceMobile',
                    type: 'text',
                    label: 'Pre Sentence Mobile',
                  },
                  {
                    name: 'lifestyles',
                    type: 'relationship',
                    relationTo: 'lifestyle',
                    hasMany: true,
                    label: 'Lifestyle',
                  },
                ],
              },
            ]),
            section('Membership', [
              {
                name: 'membership',
                type: 'array',
                label: 'Slides',
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
                  {
                    name: 'richText',
                    type: 'richText',
                    label: 'Rich Text',
                  },
                  {
                    name: 'button',
                    type: 'group',
                    label: 'Button',
                    fields: [
                      {
                        name: 'text',
                        type: 'text',
                        label: 'Text',
                      },
                      {
                        name: 'link',
                        type: 'text',
                        label: 'Link',
                      },
                    ],
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
            section('Bingo', [
              {
                name: 'bingo',
                type: 'group',
                label: 'Bingo',
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
                    name: 'grid',
                    type: 'array',
                    label: 'Grid',
                    minRows: 9,
                    maxRows: 9,
                    fields: [
                      {
                        name: 'text',
                        type: 'text',
                        label: 'Text',
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
