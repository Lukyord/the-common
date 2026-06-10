import type { Metadata } from 'next'

import DeliveryCtaSection from '@/components/branch/vendors/DeliveryCtaSection'
import VendorsListSection from '@/components/branch/vendors/VendorsListSection'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getBranchVendorPageBySlug,
  getBranchVendors,
  getLifestyles,
} from '@/payload/queries/branch'
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
  const [lifestyles, vendorResult, page] = await Promise.all([
    getLifestyles(),
    getBranchVendors(branch),
    getBranchVendorPageBySlug(branchSlug),
  ])

  return (
    <main id="main" className="vendors-page">
      <VendorMap branchSlug={branch.slug} />

      <VendorsListSection
        sectionClassName="bg-beige"
        scInnerClassName="pc-t-100 pc-b-150 mb-t-75 mb-b-75"
        branchSlug={branch.slug}
        branchTheme={{
          bgColor: branch.bgColor,
          primaryColor: branch.primaryColor,
        }}
        lifestyles={lifestyles}
        cards={vendorResult.cards}
        hasMore={vendorResult.hasMore}
        loadMoreUrl="/api/cards/vendors"
      />

      <DeliveryCtaSection data={page} />
    </main>
  )
}
