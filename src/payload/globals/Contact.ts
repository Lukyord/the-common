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
            section('Contact Form', [
              {
                name: 'contactSubject',
                type: 'text',
                label: 'Contact Subject',
                hasMany: true,
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
