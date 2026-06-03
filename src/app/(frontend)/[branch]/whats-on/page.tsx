import React from 'react'
import type { Metadata } from 'next'

import WhatsOnLanding from '@/components/branch/whats-on/WhatsOnLanding'
import { generateMeta } from '@/lib/generateMeta'
import { getBranchWhatsOnPageBySlug } from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch } = await params
  const page = await getBranchWhatsOnPageBySlug(branch)
  const branchName = typeof page.branch === 'object' ? page.branch.name : null

  return generateMeta({
    meta: page.meta,
    fallbackTitle: page.title || (branchName ? `What's On | ${branchName}` : "What's On"),
    fallbackDescription: branchName ? `What's On at ${branchName}` : "What's On at The Common",
  })
}

export default async function WhatsOnPage({ params }: Props) {
  const { branch } = await params
  const page = await getBranchWhatsOnPageBySlug(branch)

  return (
    <main id="main" className="whats-on-page">
      <WhatsOnLanding data={page.landing} />
    </main>
  )
}
