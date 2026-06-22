import type { CollectionConfig, Field } from 'payload'

import { updatePageSaveButtonCollection } from '@/payload/shared/updatePageSaveButton'

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

export const BranchContactPages: CollectionConfig = {
  slug: 'branch-contact-pages',
  labels: {
    singular: 'Branch Contact Page',
    plural: 'Branch Contact Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['branch', 'title'],
    group: 'Branches',
    description: 'Contact page per branch.',
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
    ]),
  ],
}
