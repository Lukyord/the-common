'use client'

import CardSection, { CardSectionProps } from '@/components/branch/CardSection'
import VendorCard from '@/components/branch/components/vendor-card/VendorCard'
import type { ComponentProps } from 'react'

type VendorCardProps = ComponentProps<typeof VendorCard>

type BranchVendorsSectionProps = Omit<
  CardSectionProps<VendorCardProps>,
  'sectionClassName' | 'scInnerClassName' | 'cta' | 'renderCard' | 'getCardKey'
> & {
  branchSlug?: string | null
  buttonColor?: string | null
}

export default function BranchVendorsSection({
  title,
  branchSlug,
  buttonColor,
  cards,
}: BranchVendorsSectionProps) {
  return (
    <CardSection
      sectionClassName="branch-landing-vendors"
      scInnerClassName="pc-t-100 pc-b-100 mb-t-75 mb-b-75"
      title={title}
      cards={cards}
      getCardKey={(card) => card.link ?? card.title}
      slider={{ pagination: true }}
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
      cta={
        branchSlug
          ? {
              label: 'VIEW ALL VENDORS',
              href: `/${branchSlug}/vendors`,
              buttonColor: buttonColor ?? undefined,
            }
          : undefined
      }
    />
  )
}
