import { cache } from 'react'

import type { VenueRentalPage } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

export type VenueRentalPagePayloadData = {
  venueRentalPage: VenueRentalPage | null
  error?: string
}

export const getVenueRentalPagePayloadData = cache(
  async (): Promise<VenueRentalPagePayloadData> => {
    const payload = await getPayloadClient()

    const { data, errors } = await resolvePayloadQueries({
      venueRentalPage: {
        errorMessage: 'Failed to load venue rental page global from Payload:',
        promise: payload.findGlobal({
          slug: 'venue-rental-page',
          depth: 2,
          overrideAccess: false,
        }),
      },
    })

    return {
      venueRentalPage: data.venueRentalPage,
      error: errors.venueRentalPage,
    }
  },
)
