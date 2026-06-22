import type { GlobalConfig } from 'payload'

import { updatePageSaveButtonGlobal } from '@/payload/shared/updatePageSaveButton'

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  label: 'Privacy & Policy',
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
    {
      name: 'richText',
      type: 'richText',
      label: 'Rich Text',
    },
  ],
}
