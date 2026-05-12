import type { Field, GlobalConfig } from 'payload'

const shapeOptions = {
  hexagon: 'Hexagon',
  circle: 'Circle',
  square: 'Square',
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
                    fields: [
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
                        name: 'hexCode',
                        type: 'text',
                        label: 'Hex Code',
                        admin: {
                          description: 'Use a design system hex code, e.g. #FFFFFF.',
                        },
                      },
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
                    type: 'textarea',
                    label: 'Description',
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
            section('Recommender', [
              {
                name: 'recommender',
                type: 'group',
                label: 'Recommender',
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
                    name: 'suffix',
                    type: 'text',
                    label: 'Suffix',
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
                type: 'group',
                label: 'Membership',
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
                    name: 'cardMedia',
                    type: 'array',
                    label: 'Card Media',
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
