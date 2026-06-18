import type { Field, GlobalConfig } from 'payload'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Blog Page',
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
