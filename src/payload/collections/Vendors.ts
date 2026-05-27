import type { CollectionConfig, Validate } from 'payload'
import { vendorTagSelectOptions } from '@/constants/vendorTags'

const validateVendorFloor: Validate<
  string | null | undefined,
  { branch?: number | { id: number } }
> = async (value, { data, req }) => {
  if (!value) return true

  const branchRef = data?.branch
  const branchId =
    typeof branchRef === 'object' && branchRef !== null && 'id' in branchRef
      ? branchRef.id
      : branchRef

  if (!branchId || typeof branchId !== 'number') {
    return 'Select a branch before choosing a floor.'
  }

  const branch = await req.payload.findByID({
    collection: 'branches',
    id: branchId,
    depth: 0,
  })

  const floors = branch.floors ?? []
  if (floors.some((floor) => floor.floorId === value)) {
    return true
  }

  return 'The selected floor is not valid for this branch.'
}

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  labels: {
    singular: 'Vendor',
    plural: 'Vendors',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'branch', 'floor', 'lotNumber'],
    group: 'Branches',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Media',
      admin: {
        className: 'upload-field--aspect-1',
      },
    },
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
      admin: {
        custom: {
          sourceField: 'name',
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
      name: 'branch',
      type: 'relationship',
      relationTo: 'branches',
      label: 'Branch',
      required: true,
      maxDepth: 1,
      index: true,
    },
    {
      name: 'floor',
      type: 'text',
      label: 'Floor',
      validate: validateVendorFloor,
      admin: {
        description: 'Options are loaded from the selected branch’s floors.',
        components: {
          Field: {
            path: '@/components/payload/branch-floor-select-field',
            exportName: 'BranchFloorSelectField',
          },
        },
      },
    },
    {
      name: 'floorLocation',
      type: 'text',
      label: 'Floor Location',
    },
    {
      name: 'lotNumber',
      type: 'number',
      label: 'Lot Number',
      admin: {
        description: 'The lot number of the vendor on the floor.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'vendor-categories',
      label: 'Category',
    },
    {
      name: 'lifestyles',
      type: 'relationship',
      relationTo: 'lifestyle',
      label: 'Lifestyle',
      hasMany: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'tags',
      type: 'select',
      label: 'Tags',
      hasMany: true,
      options: vendorTagSelectOptions,
    },
    {
      name: 'openingHours',
      type: 'richText',
      label: 'Opening Hours',
    },
    {
      name: 'tel',
      type: 'text',
      label: 'Tel',
      admin: {
        description: 'The format should be +66XXXXXXXXX',
      },
      hasMany: true,
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
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
        },
        {
          name: 'grab',
          type: 'text',
          label: 'Grab',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website',
        },
      ],
    },
    {
      name: 'moreAt',
      type: 'array',
      label: 'More at',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
        },
      ],
    },
  ],
}
