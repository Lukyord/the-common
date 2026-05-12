import type { GlobalConfig } from 'payload'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact',
  access: {
    read: () => true,
  },
  fields: [
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
  ],
}
