import type { CollectionConfig } from 'payload'

import { WHATS_ON_BRANCH_LOCATION_FIELDS } from '@/constants/whatsOnBranchLocations'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  labels: {
    singular: 'Blog',
    plural: 'Blogs',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'branch', 'publishedDate', 'dateToBeArchived'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      hasMany: true,
      index: true,
      maxDepth: 1,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        custom: {
          sourceField: 'title',
        },
        components: {
          Field: {
            path: '@/components/payload/generate-slug-field',
            exportName: 'GenerateSlugField',
          },
        },
      },
    },
    {
      name: 'branchLocations',
      type: 'group',
      label: 'Branch Locations',
      admin: {
        hideGutter: true,
        condition: (data) => Array.isArray(data?.branch) && data.branch.length > 0,
        description: 'Set the location for each selected branch.',
        components: {
          Field: '@/components/payload/whats-on-branch-locations-field#WhatsOnBranchLocationsField',
        },
      },
      fields: [
        ...WHATS_ON_BRANCH_LOCATION_FIELDS.map(({ name, label }) => ({
          name,
          type: 'text' as const,
          label,
        })),
      ],
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'dateToBeArchived',
      type: 'date',
      label: 'Date to be Archived',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Media',
      admin: {
        className: 'upload-field--aspect-1',
        description: 'Recommended aspect ratio: 4 / 5',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      label: 'Gallery',
      hasMany: true,
      maxRows: 5,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Button Link',
    },
  ],
}
