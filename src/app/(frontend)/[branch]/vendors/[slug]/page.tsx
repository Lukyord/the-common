import type { Metadata } from 'next'

import OtherVendors from '@/components/branch/vendors/vendor-single/OtherVendors'
import VendorSingle from '@/components/branch/vendors/vendor-single/VendorSingle'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getRelatedBranchVendorsByCategory,
  getVendorBySlug,
} from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string; slug: string }>
}

function getVendorCategoryLabel(category: Awaited<ReturnType<typeof getVendorBySlug>>['category']) {
  const firstCategory = category?.[0]
  if (!firstCategory || typeof firstCategory === 'number') return null
  return firstCategory.text ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch, slug } = await params
  const vendor = await getVendorBySlug(branch, slug)
  const branchName = typeof vendor.branch === 'object' ? vendor.branch.name : null
  const categoryLabel = getVendorCategoryLabel(vendor.category)

  return generateMeta({
    meta: vendor.meta,
    fallbackTitle: vendor.name,
    fallbackDescription:
      categoryLabel && branchName
        ? `${vendor.name} — ${categoryLabel} at ${branchName}`
        : branchName
          ? `${vendor.name} at ${branchName}`
          : vendor.name,
  })
}

export default async function VendorSinglePage({ params }: Props) {
  const { branch: branchSlug, slug } = await params
  const [branch, vendor] = await Promise.all([
    getBranchBySlug(branchSlug),
    getVendorBySlug(branchSlug, slug),
  ])
  const relatedVendors = await getRelatedBranchVendorsByCategory(branch, vendor)

  return (
    <main id="main" className="vendors-single-page">
      <VendorSingle
        vendor={vendor}
        branch={branch}
        backHref={`/${branchSlug}/vendors`}
      />

      {relatedVendors.length > 0 && (
        <OtherVendors title="TAP INTO MORE" branchSlug={branch.slug} cards={relatedVendors} />
      )}
    </main>
  )
}
