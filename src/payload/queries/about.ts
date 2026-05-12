import { cache } from 'react'

import type { About } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

export type AboutPayloadData = {
  about: About | null
  error?: string
}

export const getAboutPayloadData = cache(async (): Promise<AboutPayloadData> => {
  const payload = await getPayloadClient()

  const { data, errors } = await resolvePayloadQueries({
    about: {
      errorMessage: 'Failed to load about global from Payload:',
      promise: payload.findGlobal({
        slug: 'about',
        depth: 1,
        overrideAccess: false,
      }),
    },
  })

  return {
    about: data.about,
    error: errors.about,
  }
})
