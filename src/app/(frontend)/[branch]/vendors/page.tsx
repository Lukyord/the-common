import type { Metadata } from 'next'

import DeliveryCtaSection from '@/components/branch/vendors/DeliveryCtaSection'
import VendorsListSection from '@/components/branch/vendors/VendorsListSection'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getBranchMapVendors,
  getBranchVendorPageBySlug,
  getBranchVendors,
  getLifestyles,
  getMultiBranchVendorLookup,
} from '@/payload/queries/branch'
import MobileSectionToggle from '@/components/branch/vendors/MobileSectionToggle'
import VendorMap from '@/components/branch/vendors/VendorMap/VendorMap'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch } = await params
  const page = await getBranchVendorPageBySlug(branch)
  const branchName = typeof page.branch === 'object' ? page.branch.name : null

  return generateMeta({
    meta: page.meta,
    fallbackTitle: page.title || (branchName ? `Vendors | ${branchName}` : 'Vendors'),
    fallbackDescription: branchName ? `Vendors at ${branchName}` : 'Vendors at The Common',
  })
}

export default async function VendorPage({ params }: Props) {
  const { branch: branchSlug } = await params
  const branch = await getBranchBySlug(branchSlug)
  const [lifestyles, vendorResult, page, mapVendors, multiBranchVendorsByName] = await Promise.all([
    getLifestyles(),
    getBranchVendors(branch),
    getBranchVendorPageBySlug(branchSlug),
    getBranchMapVendors(branch),
    getMultiBranchVendorLookup(),
  ])

  return (
    <main id="main" className="vendors-page">
      <MobileSectionToggle
        branchSlug={branch.slug}
        theme={{ bgColor: branch.primaryColor, color: branch.bgColor }}
      >
        <MobileSectionToggle.Section label="FLOOR PLAN">
          <VendorMap
            branchSlug={branch.slug}
            floors={branch.floors}
            defaultMapTileColor={page.defaultMapTileColor}
            activeMapTileColor={page.activeMapTileColor}
            pinColor={page.pinColor}
            mapVendors={mapVendors}
            branchTheme={{
              bgColor: branch.primaryColor,
              primaryColor: branch.bgColor,
            }}
          />
        </MobileSectionToggle.Section>

        <MobileSectionToggle.Section label="VENDORS">
          <VendorsListSection
            sectionClassName="bg-beige"
            scInnerClassName="pc-t-100 pc-b-150 mb-t-75 mb-b-25"
            branchSlug={branch.slug}
            branchTheme={{
              bgColor: branch.bgColor,
              primaryColor: branch.primaryColor,
            }}
            lifestyles={lifestyles}
            cards={vendorResult.cards}
            hasMore={vendorResult.hasMore}
            multiBranchVendorsByName={multiBranchVendorsByName}
            loadMoreUrl="/api/cards/vendors"
          />
        </MobileSectionToggle.Section>
      </MobileSectionToggle>

      <DeliveryCtaSection data={page} />
    </main>
  )
}
