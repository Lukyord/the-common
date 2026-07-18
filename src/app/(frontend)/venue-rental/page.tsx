import type { Metadata } from 'next'

import { toVenueRentalBranchGroups } from '@/components/brand/venue-rental/toVenueRentalBranchGroups'
import { generateMeta } from '@/lib/generateMeta'
import { getVenueRentalPagePayloadData } from '@/payload/queries/venue-rental-page'

import VenueRentalLanding from '@/components/brand/venue-rental/VenueRentalLanding'
import VenueRentalEmptyState from '@/components/brand/venue-rental/VenueRentalEmptyState'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { venueRentalPage } = await getVenueRentalPagePayloadData()

  return generateMeta({
    meta: venueRentalPage?.meta,
    fallbackTitle: 'Venue Rental | The Common',
    fallbackDescription: 'Venue Rental at The Common',
    pathname: '/venue-rental',
  })
}

export default async function VenueRentalPage() {
  const { venueRentalPage, branchVenueRentalPages } = await getVenueRentalPagePayloadData()
  const groups = toVenueRentalBranchGroups(
    venueRentalPage?.branchGroups,
    branchVenueRentalPages,
  )

  if (groups.length === 0) {
    return <VenueRentalEmptyState />
  }

  return (
    <main className="venue-rental-page">
      <section data-section="venue-rental-landing">
        <VenueRentalLanding groups={groups} />
      </section>
    </main>
  )
}
