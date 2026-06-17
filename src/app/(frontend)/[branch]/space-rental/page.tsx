import type { Metadata } from 'next'
import React from 'react'

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
    fallbackTitle: page.title || (branchName ? `Space Rental | ${branchName}` : 'Space Rental'),
    fallbackDescription: branchName
      ? `Space Rental at ${branchName}`
      : 'Space Rental at The Common',
  })
}

export default function SpaceRentalPage() {
  return <div>Space Rental Page</div>
}
