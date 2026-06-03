'use client'

import CardSection from '@/components/branch/CardSection'
import VendorCard from '@/components/branch/components/VendorCard'

type BranchVendorsSectionProps = {
  title?: string | null
  branchSlug?: string | null
  buttonColor?: string | null
  cards: {
    id: number
    title: string
    link: string
    media: {
      src: string
      alt: string
    }
    tags: string[]
    location: string
  }[]
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
      getCardKey={(card) => card.id}
      renderCard={(card) => (
        <VendorCard
          branchSlug={branchSlug}
          title={card.title}
          media={card.media}
          tags={card.tags}
          location={card.location}
          link={card.link}
        />
      )}
      cta={{
        label: 'VIEW VENDORS',
        href: `/${branchSlug}/vendors`,
        buttonColor: buttonColor ?? undefined,
      }}
    />
  )
}
