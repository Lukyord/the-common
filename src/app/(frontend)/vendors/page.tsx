import type { Metadata } from 'next'
import React from 'react'

import AllVendorsContent from '@/components/brand/vendors/AllVendorsContent'
import type { BranchVendorCard } from '@/components/branch/vendors/types'
import { BRANCH_VENDORS_PAGE_SIZE } from '@/components/branch/vendors/types'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import { ALL_BRANCH_FILTER_SLUG } from '@/constants/branchFilterShapes'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranches,
  getGlobalVendorsForFilterPage,
  getLifestyles,
  getMultiBranchVendorLookup,
} from '@/payload/queries/branch'
import { getVendorsPagePayloadData } from '@/payload/queries/vendors-page'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { vendorsPage } = await getVendorsPagePayloadData()

  return generateMeta({
    meta: vendorsPage?.meta,
    fallbackTitle: vendorsPage?.title || 'Vendors | The Common',
    fallbackDescription: 'Vendors at The Common',
  })
}

export default async function VendorsPage() {
  const { vendorsPage } = await getVendorsPagePayloadData()
  const title = vendorsPage?.title || 'Vendors'

  const branches = (await getBranches()).filter((branch) => branch.slug)

  if (branches.length === 0) {
    return (
      <main className="vendors-page bg-beige">
        <section data-section="all-vendors" className="header-padding">
          <div className="sc-inner pc-t-100 pc-b-200 mb-t-75 mb-b-100">
            <div className="container">
              <p className="vendors-empty type-d-body-m type-m-body-s letter-spacing-002">
                No branches found.
              </p>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const [lifestyles, vendorResult, multiBranchVendorsByName] = await Promise.all([
    getLifestyles(),
    getGlobalVendorsForFilterPage(1, BRANCH_VENDORS_PAGE_SIZE),
    getMultiBranchVendorLookup(),
  ])

  const branchOptions = branches.map((item) => ({
    slug: item.slug!,
    name: item.name,
    bgColor: item.bgColor,
    primaryColor: item.primaryColor,
  }))

  return (
    <main className="vendors-page bg-beige">
      <section data-section="all-vendors" className="header-padding">
        <div className="sc-inner pc-t-100 pc-b-200 mb-t-75 mb-b-100">
          <div className="container">
            <AllVendorsContent
              titleNode={
                <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
                  <MarkdownContent
                    as="h1"
                    inline
                    className="type-d-display type-m-display weight-medium letter-spacing-002"
                  >
                    {title}
                  </MarkdownContent>
                </AnimateOnScroll>
              }
              branches={branchOptions}
              lifestyles={lifestyles}
              initialBranchSlug={ALL_BRANCH_FILTER_SLUG}
              initialTagCards={vendorResult.cards as BranchVendorCard[]}
              initialTagHasMore={vendorResult.hasMore}
              multiBranchVendorsByName={multiBranchVendorsByName}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
