import type { GlobalConfig, Field } from 'payload'

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

export const VendorsPage: GlobalConfig = {
  slug: 'vendors-page',
  label: 'Vendors Page',
  admin: updatePageSaveButtonGlobal,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    section('Delivery', [
      colorPickerField('backgroundColor', 'Background Color'),
      colorPickerField('textColor', 'Text Color'),
      {
        name: 'deliveryTitle',
        type: 'text',
        label: 'Delivery Title',
      },
      {
        name: 'content',
        type: 'richText',
        label: 'Content',
      },
      {
        name: 'grabLink',
        type: 'text',
        label: 'Grab Link',
      },
      {
        name: 'linemanLink',
        type: 'text',
        label: 'Lineman Link',
      },
    ]),
  ],
}
