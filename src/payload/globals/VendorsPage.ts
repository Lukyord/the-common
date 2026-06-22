import type { GlobalConfig } from 'payload'

import { updatePageSaveButtonGlobal } from '@/payload/shared/updatePageSaveButton'

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
  ],
}
