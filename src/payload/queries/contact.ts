import { cache } from 'react'

import type { Contact } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

export type ContactPayloadData = {
  contact: Contact | null
  error?: string
}

export const getContactPayloadData = cache(async (): Promise<ContactPayloadData> => {
  const payload = await getPayloadClient()

  const { data, errors } = await resolvePayloadQueries({
    contact: {
      errorMessage: 'Failed to load contact global from Payload:',
      promise: payload.findGlobal({
        slug: 'contact',
        depth: 1,
        overrideAccess: false,
      }),
    },
  })

  return {
    contact: data.contact,
    error: errors.contact,
  }
})
