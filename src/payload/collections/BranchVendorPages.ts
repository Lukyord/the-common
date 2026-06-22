import type { CollectionConfig, Field } from 'payload'

import { updatePageSaveButtonCollection } from '@/payload/shared/updatePageSaveButton'

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

export const BranchVendorPages: CollectionConfig = {
  slug: 'branch-vendor-pages',
  labels: {
    singular: 'Branch Vendor Page',
    plural: 'Branch Vendor Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['branch', 'title'],
    group: 'Branches',
    description: 'Vendors page per branch.',
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
    section('Map', [
      colorPickerField('defaultMapTileColor', 'Default Map Tile Color'),
      colorPickerField('activeMapTileColor', 'Active Map Tile Color'),
      colorPickerField('pinColor', 'Pin Color'),
    ]),
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
