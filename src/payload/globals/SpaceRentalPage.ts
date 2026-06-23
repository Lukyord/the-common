import type { Field, GlobalConfig } from 'payload'

import { updatePageSaveButtonGlobal } from '@/payload/shared/updatePageSaveButton'

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

const branchGroupFields: Field[] = [
  {
    name: 'branch',
    type: 'relationship',
    relationTo: 'branches',
    label: 'Branch',
    required: true,
  },
  {
    name: 'mediaGallery',
    type: 'upload',
    relationTo: 'media',
    label: 'Media Gallery',
    hasMany: true,
  },
  colorPickerField('bgColor', 'Background Color'),
  colorPickerField('textColor', 'Text Color'),
  colorPickerField('buttonColor', 'Button Color'),
  {
    name: 'title',
    type: 'text',
    label: 'Title',
  },
  {
    name: 'cta',
    type: 'group',
    label: 'CTA',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        name: 'text',
        type: 'text',
        label: 'Text',
      },
      {
        name: 'desc',
        type: 'textarea',
        label: 'Description',
      },
    ],
  },
]

export const VenueRentalPage: GlobalConfig = {
  slug: 'venue-rental-page',
  label: 'Venue Rental Page',
  admin: updatePageSaveButtonGlobal,
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
            section('Branch Groups', [
              {
                name: 'branchGroups',
                type: 'array',
                label: 'Branch Groups',
                minRows: 3,
                maxRows: 3,
                admin: {
                  description: 'One group per branch (3 total).',
                },
                fields: branchGroupFields,
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
