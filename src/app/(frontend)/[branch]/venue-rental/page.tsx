import type { Metadata } from 'next'

import BranchVenueRentalBookingSection from '@/components/branch/venue-rental/BranchVenueRentalBookingSection'
import BranchVenueRentalColContent, {
  toBranchVenueRentalColContentProps,
} from '@/components/branch/venue-rental/BranchVenueRentalColContent'
import BranchVenueRentalHeader, {
  toBranchVenueRentalHeaderProps,
} from '@/components/branch/venue-rental/BranchVenueRentalHeader'
import { getVenueFormOptionNames } from '@/components/branch/venue-rental/getVenueFormOptionNames'
import { generateMeta } from '@/lib/generateMeta'
import { getBranchSpaceRentalPageBySlug } from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch } = await params
  const page = await getBranchSpaceRentalPageBySlug(branch)
  const branchName = typeof page.branch === 'object' ? page.branch.name : null

  return generateMeta({
    meta: page.meta,
    fallbackTitle: page.title || (branchName ? `Venue Rental | ${branchName}` : 'Venue Rental'),
    fallbackDescription: branchName
      ? `Venue Rental at ${branchName}`
      : 'Venue Rental at The Common',
  })
}

export default async function VenueRentalPage({ params }: Props) {
  const { branch } = await params
  const page = await getBranchSpaceRentalPageBySlug(branch)
  const branchName =
    (typeof page.branch === 'object' ? page.branch.name : null) ?? page.branchName ?? null
  const formAreaOptions = getVenueFormOptionNames(page)

  const headerProps = toBranchVenueRentalHeaderProps({
    title: page.title,
    branchName,
    landingMedia: page.landingMedia,
    venuePackage: page.venuePackage,
  })
  const rateSectionProps = toBranchVenueRentalColContentProps(page.rate)
  const promoSectionProps = toBranchVenueRentalColContentProps(page.promo)

  return (
    <main className="branch-venue-rental-page">
      <section data-section="branch-venue-rental-landing">
        <div className="sc-header">
          <BranchVenueRentalHeader {...headerProps} />
        </div>
        <div className="sc-content">
          <BranchVenueRentalBookingSection
            formTitle="VENUE RENTAL"
            formAreaOptions={formAreaOptions}
            bookingCta={page.bookingCta}
          />
        </div>
      </section>

      {rateSectionProps && <BranchVenueRentalColContent {...rateSectionProps} />}
      {promoSectionProps && <BranchVenueRentalColContent {...promoSectionProps} />}
    </main>
  )
}
