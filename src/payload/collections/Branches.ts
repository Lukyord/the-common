import type { CollectionConfig, Field, Validate } from 'payload'

import {
  BRANCH_ABOUT_WORDS_BY_SLUG,
  getBranchAboutWordLabel,
  type BranchAboutWord,
} from '@/constants/branchAboutWords'
import { getActiveWhatsOnWhere } from '@/lib/whatsOnArchive'
import { syncBranchAboutWordGroups } from '@/payload/hooks/syncBranchAboutWordGroups'
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

const heroFields: Field[] = [
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
]

const validateHighlightVendors: Validate = (value) => {
  if (!value) return true

  if (!Array.isArray(value)) return true

  return value.length <= 3 || 'You can select up to 3 highlighted vendors.'
}

const validateHighlightWhatsOn: Validate = (value) => {
  if (!value) return true

  if (!Array.isArray(value)) return true

  return value.length <= 3 || "You can select up to 3 highlighted what's on items."
}

const validateAboutWordGroups: Validate = (value, { data }) => {
  const slug = data?.slug
  if (!slug || typeof slug !== 'string') return true

  const expected = BRANCH_ABOUT_WORDS_BY_SLUG[slug]
  if (!expected) return true

  if (!Array.isArray(value)) {
    return `This branch requires ${expected.length} word groups.`
  }

  if (value.length !== expected.length) {
    return `This branch requires exactly ${expected.length} word groups.`
  }

  for (let i = 0; i < expected.length; i++) {
    const row = value[i] as { word?: BranchAboutWord } | undefined
    if (row?.word !== expected[i]) {
      return `Word group ${i + 1} must be "${getBranchAboutWordLabel(expected[i])}".`
    }
  }

  return true
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

export const Branches: CollectionConfig = {
  slug: 'branches',
  labels: {
    singular: 'Branch',
    plural: 'Branches',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Branches',
    description: 'Branch identity and landing page content.',
    ...updatePageSaveButtonCollection,
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [syncBranchAboutWordGroups],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Branch Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              label: 'Slug',
              required: true,
              unique: true,
              index: true,
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Branch Logo',
            },
            {
              name: 'tel',
              type: 'text',
              label: 'Tel',
            },
            {
              name: 'floors',
              type: 'array',
              label: 'Floors',
              fields: [
                {
                  name: 'floorId',
                  type: 'text',
                  label: 'Id',
                  required: true,
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  required: true,
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
              ],
            },
            colorPickerField('primaryColor', 'Primary Color'),
            colorPickerField('bgColor', 'Background Color'),
            colorPickerField('footerBg', 'Footer Background Color'),
            colorPickerField('footerColor', 'Footer Color'),
            {
              name: 'findUs',
              type: 'richText',
              label: 'Find Us',
            },
            {
              name: 'openingHours',
              type: 'richText',
              label: 'Opening Hours',
            },
            {
              name: 'parkingOptions',
              type: 'richText',
              label: 'Parking Options',
            },
          ],
        },
        {
          label: 'Branch Landing',
          fields: [
            section('Hero', [
              {
                name: 'hero',
                type: 'group',
                label: 'Hero',
                admin: {
                  hideGutter: true,
                },
                fields: heroFields,
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
                  colorPickerField('bgColor', 'Background Color'),
                  {
                    name: 'wordGroups',
                    type: 'array',
                    label: 'Word Groups',
                    validate: validateAboutWordGroups,
                    admin: {
                      description:
                        'Words are fixed per branch slug. Fill in media, title, and description for each word below.',
                      isSortable: false,
                      components: {
                        Field:
                          '@/components/payload/branch-about-word-groups-field#BranchAboutWordGroupsField',
                      },
                    },
                    fields: [
                      {
                        name: 'word',
                        type: 'text',
                        required: true,
                        admin: {
                          hidden: true,
                        },
                      },
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
                    ],
                  },
                ],
              },
            ]),
            section('Vibes Check', [
              {
                name: 'vibesCheck',
                type: 'group',
                label: 'Vibes Check',
                admin: {
                  hideGutter: true,
                },
                fields: [
                  {
                    name: 'title',
                    type: 'text',
                    label: 'Title',
                  },
                  colorPickerField('titleColor', 'Title Color'),
                  colorPickerField('titleBgColor', 'Title Background Color'),
                  colorPickerField('primaryColor', 'Button Primary Color'),
                  colorPickerField('secondaryColor', 'ButtonSecondary Color'),
                  {
                    name: 'gallery',
                    type: 'array',
                    label: 'Gallery',
                    fields: [
                      {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                      },
                      {
                        name: 'day',
                        type: 'group',
                        label: 'Day',
                        fields: [
                          {
                            name: 'media',
                            type: 'upload',
                            relationTo: 'media',
                            label: 'Media',
                          },
                          {
                            name: 'mediaMobile',
                            type: 'upload',
                            relationTo: 'media',
                            label: 'Media Mobile',
                          },
                        ],
                      },
                      {
                        name: 'night',
                        type: 'group',
                        label: 'Night',
                        fields: [
                          {
                            name: 'media',
                            type: 'upload',
                            relationTo: 'media',
                            label: 'Media',
                          },
                          {
                            name: 'mediaMobile',
                            type: 'upload',
                            relationTo: 'media',
                            label: 'Media Mobile',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ]),
            section('Vendors Section', [
              {
                name: 'vendorsSection',
                type: 'group',
                label: 'Vendors Section',
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
                    name: 'displayType',
                    type: 'radio',
                    label: 'Branch Display Type',
                    defaultValue: 'latest',
                    options: [
                      {
                        label: 'Latest',
                        value: 'latest',
                      },
                      {
                        label: 'Highlight',
                        value: 'highlight',
                      },
                    ],
                  },
                  {
                    name: 'highlightVendors',
                    type: 'relationship',
                    relationTo: 'vendors',
                    label: 'Highlight Vendors',
                    hasMany: true,
                    validate: validateHighlightVendors,
                    admin: {
                      condition: (_, siblingData) => siblingData?.displayType === 'highlight',
                      description:
                        'Manually select up to 3 vendors. Only vendors from this branch are shown.',
                    },
                    filterOptions: ({ data }) => {
                      if (!data?.id || typeof data.id !== 'number') {
                        return false
                      }

                      return {
                        branch: {
                          equals: data.id,
                        },
                      }
                    },
                  },
                ],
              },
            ]),
            section("What's On Section", [
              {
                name: 'whatsOnSection',
                type: 'group',
                label: "What's On Section",
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
                    name: 'displayType',
                    type: 'radio',
                    label: 'Branch Display Type',
                    defaultValue: 'latest',
                    options: [
                      {
                        label: 'Latest',
                        value: 'latest',
                      },
                      {
                        label: 'Highlight',
                        value: 'highlight',
                      },
                    ],
                  },
                  {
                    name: 'highlightWhatsOn',
                    type: 'relationship',
                    relationTo: 'whats-on',
                    label: "Highlight What's On",
                    hasMany: true,
                    validate: validateHighlightWhatsOn,
                    admin: {
                      condition: (_, siblingData) => siblingData?.displayType === 'highlight',
                      description:
                        'Manually select up to 3 items. Only active items linked to this branch are shown.',
                    },
                    filterOptions: ({ data }) => {
                      if (!data?.id || typeof data.id !== 'number') {
                        return false
                      }

                      return {
                        and: [
                          {
                            branch: {
                              contains: data.id,
                            },
                          },
                          getActiveWhatsOnWhere(),
                        ],
                      }
                    },
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
