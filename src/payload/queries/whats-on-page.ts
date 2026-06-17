import { cache } from 'react'

import type { WhatsOnPage } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

export type WhatsOnPagePayloadData = {
  whatsOnPage: WhatsOnPage | null
  error?: string
}

export const getWhatsOnPagePayloadData = cache(async (): Promise<WhatsOnPagePayloadData> => {
  const payload = await getPayloadClient()

  const { data, errors } = await resolvePayloadQueries({
    whatsOnPage: {
      errorMessage: "Failed to load what's on global from Payload:",
      promise: payload.findGlobal({
        slug: 'whats-on-page',
        depth: 1,
        overrideAccess: false,
      }),
    },
  })

  return {
    whatsOnPage: data.whatsOnPage,
    error: errors.whatsOnPage,
  }
})
