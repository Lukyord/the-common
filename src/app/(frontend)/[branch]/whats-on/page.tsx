import React from 'react'
import type { Metadata } from 'next'

import WhatsOnClub from '@/components/branch/whats-on/WhatsOnClub'
import WhatsOnLanding from '@/components/branch/whats-on/WhatsOnLanding'
import WhatsOnLatest from '@/components/branch/whats-on/WhatsOnLatest'
import WhatsOnOthers from '@/components/branch/whats-on/WhatsOnOthers'
import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getBranchWhatsOnByMainTag,
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
  const page = await getBranchWhatsOnPageBySlug(branchSlug)
  const clubMainTagId =
    typeof page.club?.mainTag === 'object' ? page.club.mainTag?.id : page.club?.mainTag
  const othersMainTagIds =
    page.allEventsAndWorkshops?.mainTag
      ?.map((tag) => (typeof tag === 'object' && tag ? tag.id : tag))
      .filter((id): id is number => typeof id === 'number' && Boolean(id)) ?? []

  const othersCardsPromise =
    othersMainTagIds.length > 0
      ? Promise.all(othersMainTagIds.map((id) => getBranchWhatsOnByMainTag(branch, id))).then(
          (cardArrays) => cardArrays.flat(),
        )
      : Promise.resolve([])

  const [whatsOnCards, clubCards, othersCards] = await Promise.all([
    getBranchWhatsOnLatest(branch),
    clubMainTagId ? getBranchWhatsOnByMainTag(branch, clubMainTagId) : Promise.resolve([]),
    othersCardsPromise,
  ])

  const uniqueOthersCards = Array.from(new Map(othersCards.map((c) => [c.id, c])).values())

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
      <WhatsOnClub
        sectionClassName="whats-on-club bg-checked"
        scInnerClassName="pc-t-100 pc-b-100 mb-t-75 mb-b-75"
        title={page.club?.title}
        cards={clubCards}
        cta={{
          label: 'ALL BRANCHES',
          href: '/whats-on',
          buttonColor: branch.bgColor ?? undefined,
        }}
      />

      <WhatsOnOthers
        sectionClassName="whats-on-others"
        title={page.allEventsAndWorkshops?.title}
        branchSlug={branch.slug}
        themeColor={{
          bgColor: branch.bgColor,
          color: branch.primaryColor,
        }}
        sectionStyle={{
          backgroundColor: page.allEventsAndWorkshops?.background ?? undefined,
        }}
        eventArchiveBackground={page.allEventsAndWorkshops?.eventArchiveBackground}
        cards={uniqueOthersCards}
      />
    </main>
  )
}
