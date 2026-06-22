import { cache } from 'react'

import type { VendorsPage } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

export type VendorsPagePayloadData = {
  vendorsPage: VendorsPage | null
  error?: string
}

export const getVendorsPagePayloadData = cache(async (): Promise<VendorsPagePayloadData> => {
  const payload = await getPayloadClient()

  const { data, errors } = await resolvePayloadQueries({
    vendorsPage: {
      errorMessage: 'Failed to load vendors page global from Payload:',
      promise: payload.findGlobal({
        slug: 'vendors-page',
        depth: 1,
        overrideAccess: false,
      }),
    },
  })

  return {
    vendorsPage: data.vendorsPage,
    error: errors.vendorsPage,
  }
})
