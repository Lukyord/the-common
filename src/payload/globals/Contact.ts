import type { Field, GlobalConfig } from 'payload'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact',
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
            section('Background', [
              {
                name: 'contactBg',
                type: 'upload',
                relationTo: 'media',
                label: 'Contact BG',
              },
              {
                name: 'contactBgMobile',
                type: 'upload',
                relationTo: 'media',
                label: 'Contact BG Mobile',
              },
            ]),
            section('Contact Form', [
              {
                name: 'contactSubject',
                type: 'text',
                label: 'Contact Subject',
                hasMany: true,
              },
            ]),
            section('Accordion', [
              {
                name: 'accordion',
                type: 'blocks',
                label: 'Accordion',
                blocks: [
                  {
                    slug: 'doubleColumn',
                    labels: {
                      singular: 'Double Column',
                      plural: 'Double Columns',
                    },
                    fields: [
                      {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                      },
                      {
                        name: 'columns',
                        type: 'array',
                        label: 'Columns',
                        fields: [
                          {
                            name: 'title',
                            type: 'text',
                            label: 'Title',
                          },
                          {
                            name: 'richText',
                            type: 'richText',
                            label: 'Rich Text',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    slug: 'singleColumn',
                    labels: {
                      singular: 'Single Column',
                      plural: 'Single Columns',
                    },
                    fields: [
                      {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                      },
                      {
                        name: 'richText',
                        type: 'richText',
                        label: 'Rich Text',
                      },
                      {
                        name: 'buttonText',
                        type: 'text',
                        label: 'Button Text',
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
            section('Contact Details', [
              {
                name: 'email',
                type: 'email',
                label: 'Email',
              },
              {
                name: 'tel',
                type: 'text',
                label: 'Tel',
              },
              {
                name: 'kinnestGroup',
                type: 'text',
                label: 'Kinnest Group',
              },
              {
                name: 'social',
                type: 'group',
                label: 'Social',
                admin: {
                  hideGutter: true,
                },
                fields: [
                  {
                    name: 'instagram',
                    type: 'text',
                    label: 'Instagram',
                  },
                  {
                    name: 'facebook',
                    type: 'text',
                    label: 'Facebook',
                  },
                  {
                    name: 'line',
                    type: 'text',
                    label: 'Line',
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
