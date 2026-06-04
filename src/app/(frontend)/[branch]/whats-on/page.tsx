import React from 'react'
import type { Metadata } from 'next'

import WhatsOnLanding from '@/components/branch/whats-on/WhatsOnLanding'
import WhatsOnLatest from '@/components/branch/whats-on/whats-on-latest/WhatsOnLatest'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getBranchWhatsOnLatest,
  getBranchWhatsOnPageBySlug,
} from '@/payload/queries/branch'

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
  const { branch: branchSlug } = await params
  const branch = await getBranchBySlug(branchSlug)
  const [page, whatsOnCards] = await Promise.all([
    getBranchWhatsOnPageBySlug(branchSlug),
    getBranchWhatsOnLatest(branch),
  ])

  return (
    <main id="main" className="whats-on-page">
      <WhatsOnLanding data={page.landing} />
      <WhatsOnLatest
        title={page.latest?.title}
        background={page.latest?.background}
        allBranchesBackground={page.latest?.allBranchesBackground}
        branchSlug={branch.slug}
        themeColor={{
          bgColor: branch.bgColor,
          color: branch.primaryColor,
        }}
        cards={whatsOnCards}
        emptyMessage="Hang tight—good things take time! We’re currently hand-picking meaningful activities to share with the community."
      />
    </main>
  )
}
