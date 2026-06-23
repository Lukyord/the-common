import { cache } from 'react'

import type { BranchVenueRentalPage, VenueRentalPage } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

export type VenueRentalBranchVenuePage = Pick<
  BranchVenueRentalPage,
  'branch' | 'venues' | 'bookingCta'
>

export type VenueRentalPagePayloadData = {
  venueRentalPage: VenueRentalPage | null
  branchVenueRentalPages: VenueRentalBranchVenuePage[]
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
      branchVenueRentalPages: {
        errorMessage: 'Failed to load branch venue rental pages from Payload:',
        promise: payload.find({
          collection: 'branch-venue-rental-pages',
          depth: 0,
          limit: 10,
          overrideAccess: false,
          select: {
            branch: true,
            venues: true,
            bookingCta: true,
          },
        }),
      },
    })

    return {
      venueRentalPage: data.venueRentalPage,
      branchVenueRentalPages: (data.branchVenueRentalPages?.docs ??
        []) as VenueRentalBranchVenuePage[],
      error: errors.venueRentalPage ?? errors.branchVenueRentalPages,
    }
  },
)
