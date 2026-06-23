import type { CollectionConfig, Field } from 'payload'

import { venueAmenityIconSelectOptions } from '@/constants/venueAmenityIcons'
import { syncBranchVenueRentalPageBranchName } from '@/payload/hooks/syncBranchVenueRentalPageBranchName'
import { exclusiveCheckboxField } from '@/payload/shared/exclusiveCheckboxField'
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

function conditionalColorPickerField(
  name: string,
  label: string,
  condition: (_: unknown, siblingData?: Record<string, unknown>) => boolean,
): Field {
  const field = colorPickerField(name, label)

  return {
    ...field,
    admin: {
      ...field.admin,
      condition,
    },
  } as Field
}

function whenBookingCtaType(type: 'form' | 'linkout') {
  return (_: unknown, siblingData?: Record<string, unknown>) => siblingData?.type === type
}

const bookingCtaFields: Field[] = [
  {
    name: 'type',
    type: 'radio',
    label: 'Type',
    defaultValue: 'form',
    options: [
      { label: 'Form', value: 'form' },
      { label: 'Link Out', value: 'linkout' },
    ],
  },
  conditionalColorPickerField(
    'formSelectedButtonBgColor',
    'Form Selected Button Background Color',
    whenBookingCtaType('form'),
  ),
  conditionalColorPickerField(
    'formSelectedButtonTextColor',
    'Form Selected Button Text Color',
    whenBookingCtaType('form'),
  ),
  conditionalColorPickerField(
    'formSubmitButtonBgColor',
    'Form Submit Button Background Color',
    whenBookingCtaType('form'),
  ),
  exclusiveCheckboxField(
    'formSubmitWhiteTextOnHover',
    'Form Submit White Text on Hover',
    'formSubmitDarkBrownTextOnHover',
    'If enabled, the form submit button text will be white on hover. Cannot be selected with dark brown hover text.',
    whenBookingCtaType('form'),
  ),
  exclusiveCheckboxField(
    'formSubmitDarkBrownTextOnHover',
    'Form Submit Dark Brown Text on Hover',
    'formSubmitWhiteTextOnHover',
    'If enabled, the form submit button text will be dark brown on hover. Cannot be selected with white hover text.',
    whenBookingCtaType('form'),
  ),
  {
    name: 'linkoutDescription',
    type: 'richText',
    label: 'Link Out Description',
    admin: {
      condition: whenBookingCtaType('linkout'),
    },
  },
  conditionalColorPickerField(
    'linkoutButtonBgColor',
    'Button Background Color',
    whenBookingCtaType('linkout'),
  ),
  {
    name: 'linkoutButtonText',
    type: 'text',
    label: 'Button Text',
    admin: {
      condition: whenBookingCtaType('linkout'),
    },
  },
  {
    name: 'linkoutButtonLink',
    type: 'text',
    label: 'Button Link',
    admin: {
      condition: whenBookingCtaType('linkout'),
    },
  },
  {
    name: 'linkoutButtonWhiteTextOnHover',
    type: 'checkbox',
    label: 'Button White Text on Hover',
    defaultValue: false,
    admin: {
      condition: whenBookingCtaType('linkout'),
      description: 'If enabled, the button text will be white on hover.',
    },
  },
]

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

const iconTextFields: Field[] = [
  {
    name: 'icon',
    type: 'select',
    label: 'Icon',
    options: venueAmenityIconSelectOptions,
  },
  {
    name: 'text',
    type: 'text',
    label: 'Text',
  },
]

const rateTableContentFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    label: 'Title',
  },
  {
    name: 'rows',
    type: 'text',
    label: 'Values',
    hasMany: true,
    admin: {
      description: 'Row labels. Each column below gets one cell per row label, in the same order.',
    },
  },
  {
    name: 'cols',
    type: 'array',
    label: 'Columns',
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
      },
      {
        name: 'cells',
        type: 'array',
        label: 'Values',
        admin: {
          description: 'Cells are generated automatically from row labels above.',
          isSortable: false,
          components: {
            Field: '@/components/payload/rate-table-column-cells-field#RateTableColumnCellsField',
          },
        },
        fields: [
          {
            name: 'value',
            type: 'text',
            label: 'Value',
          },
        ],
      },
    ],
  },
]

function rateSectionField(name: string, label: string): Field {
  return {
    name,
    type: 'group',
    label,
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
      colorPickerField('backgroundColor', 'Background Color'),
      colorPickerField('textColor', 'Text Color'),
      {
        name: 'cnt',
        type: 'group',
        label: 'Content',
        admin: {
          hideGutter: true,
        },
        fields: rateTableContentFields,
      },
    ],
  }
}

const venueFields: Field[] = [
  {
    name: 'show',
    type: 'checkbox',
    label: 'Show',
    defaultValue: true,
    admin: {
      description: 'If enabled, the venue will be shown on the page.',
    },
  },
  {
    name: 'title',
    type: 'text',
    label: 'Title',
  },
  {
    name: 'formOptionName',
    type: 'text',
    label: 'Form Option Name',
  },
  colorPickerField('buttonBgColor', 'Button Background Color'),
  colorPickerField('buttonTextColor', 'Button Text Color'),
  {
    name: 'mediaGallery',
    type: 'upload',
    relationTo: 'media',
    label: 'Media Gallery',
    hasMany: true,
  },
  {
    name: 'amenitiesDescription',
    type: 'richText',
    label: 'Amenities Description',
  },
  {
    name: 'venueDescription',
    type: 'array',
    label: 'Venue Description',
    fields: [
      {
        name: 'content',
        type: 'richText',
        label: 'Content',
      },
    ],
  },
  {
    name: 'information',
    type: 'group',
    label: 'Information',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        name: 'area',
        type: 'text',
        label: 'Area',
      },
      {
        name: 'numberOfPeople',
        type: 'text',
        label: 'Number of People',
      },
    ],
  },
  {
    name: 'venueAmenities',
    type: 'array',
    label: 'Venue Amenities',
    fields: iconTextFields,
  },
  {
    name: 'otherAmenities',
    type: 'array',
    label: 'Other Amenities',
    fields: iconTextFields,
  },
  {
    name: 'additionalFee',
    type: 'array',
    label: 'Additional Fee',
    fields: iconTextFields,
  },
  {
    name: 'staffFee',
    type: 'group',
    label: 'Staff Fee',
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
        name: 'info',
        type: 'array',
        label: 'Info',
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
        ],
      },
    ],
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
        name: 'ctaText',
        type: 'text',
        label: 'CTA Text',
      },
      {
        name: 'ctaLink',
        type: 'text',
        label: 'CTA Link',
      },
      colorPickerField('buttonBgColor', 'Button Background Color'),
    ],
  },
]

export const BranchSpaceRentalPages: CollectionConfig = {
  slug: 'branch-venue-rental-pages',
  labels: {
    singular: 'Branch Venue Rental Page',
    plural: 'Branch Venue Rental Pages',
  },
  admin: {
    useAsTitle: 'branchName',
    defaultColumns: ['branchName', 'branch'],
    group: 'Branches',
    description: 'Venue rental page per branch.',
    ...updatePageSaveButtonCollection,
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [syncBranchVenueRentalPageBranchName],
  },
  fields: [
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'branchName',
      type: 'text',
      label: 'Branch Name',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    section('Booking CTA', [
      {
        name: 'bookingCta',
        type: 'group',
        label: 'Booking CTA',
        admin: {
          hideGutter: true,
        },
        fields: bookingCtaFields,
      },
    ]),
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    section('Landing', [
      {
        name: 'landingMedia',
        type: 'group',
        label: 'Landing Media',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'desktop',
            type: 'upload',
            relationTo: 'media',
            label: 'Desktop',
          },
          {
            name: 'mobile',
            type: 'upload',
            relationTo: 'media',
            label: 'Mobile',
          },
        ],
      },
    ]),
    section('Venue Package', [
      {
        name: 'venuePackage',
        type: 'group',
        label: 'Venue Package',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            name: 'type',
            type: 'radio',
            label: 'Type',
            defaultValue: 'link',
            options: [
              { label: 'PDF', value: 'pdf' },
              { label: 'Link', value: 'link' },
            ],
          },
          {
            name: 'pdf',
            type: 'upload',
            relationTo: 'media',
            label: 'PDF',
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'pdf',
            },
          },
          {
            name: 'link',
            type: 'text',
            label: 'Link',
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'link',
            },
          },
        ],
      },
    ]),
    section('Venues', [
      {
        name: 'venues',
        type: 'array',
        label: 'Venues',
        fields: venueFields,
      },
    ]),
    section('Venue Rental Rate', [rateSectionField('rate', 'Venue Rental Rate')]),
    section('Promotions', [rateSectionField('promo', 'Promotions')]),
  ],
}
