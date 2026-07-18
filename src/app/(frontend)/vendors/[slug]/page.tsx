import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import OtherVendors from '@/components/branch/vendors/vendor-single/OtherVendors'
import VendorSingle from '@/components/branch/vendors/vendor-single/VendorSingle'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getGlobalVendorBySlug,
  getRelatedBranchVendorsByCategory,
  getVendorBySlug,
} from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

function getVendorCategoryLabel(category: Awaited<ReturnType<typeof getVendorBySlug>>['category']) {
  const firstCategory = category?.[0]
  if (!firstCategory || typeof firstCategory === 'number') return null
  return firstCategory.text ?? null
}

function getVendorBranchSlug(vendor: Awaited<ReturnType<typeof getGlobalVendorBySlug>>) {
  const branch = typeof vendor.branch === 'object' ? vendor.branch : null
  return branch?.slug ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vendor = await getGlobalVendorBySlug(slug)
  const branchSlug = getVendorBranchSlug(vendor)
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
    pathname: `/vendors/${slug}`,
    ...(branchSlug ? { canonicalPath: `/${branchSlug}/vendors/${slug}` } : {}),
  })
}

export default async function BrandVendorSinglePage({ params }: Props) {
  const { slug } = await params
  const vendor = await getGlobalVendorBySlug(slug)
  const branchSlug = getVendorBranchSlug(vendor)
  if (!branchSlug) notFound()

  const branch = await getBranchBySlug(branchSlug)
  const relatedVendors = await getRelatedBranchVendorsByCategory(branch, vendor, 'brand')

  return (
    <main id="main" className="vendors-single-page">
      <VendorSingle vendor={vendor} branch={branch} backHref="/vendors" />

      {relatedVendors.length > 0 && (
        <OtherVendors title="TAP INTO MORE" branchSlug={branch.slug} cards={relatedVendors} />
      )}
    </main>
  )
}
