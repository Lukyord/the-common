'use client'

import CardSection, { CardSectionProps } from '@/components/branch/CardSection'
import VendorCard from '@/components/branch/components/VendorCard'
import type { ComponentProps } from 'react'

type VendorCardProps = ComponentProps<typeof VendorCard>

type OtherVendorsProps = Omit<
  CardSectionProps<VendorCardProps>,
  'sectionClassName' | 'scInnerClassName' | 'cta' | 'renderCard' | 'getCardKey'
> & {
  branchSlug?: string | null
}

export default function OtherVendors({ title, branchSlug, cards }: OtherVendorsProps) {
  return (
    <CardSection
      sectionClassName="other-vendors"
      scInnerClassName="pc-t-100 pc-b-100 mb-t-75 mb-b-75"
      title={title}
      cards={cards}
      getCardKey={(card) => card.link ?? card.title}
      renderCard={(card) => (
        <VendorCard
          branchSlug={branchSlug}
          branches={card.branches}
          title={card.title}
          media={card.media}
          tags={card.tags}
          location={card.location}
          link={card.link}
        />
      )}
    />
  )
}
