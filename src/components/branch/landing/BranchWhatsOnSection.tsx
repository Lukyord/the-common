'use client'

import CardSection from '@/components/branch/CardSection'
import WhatsOnCard from '@/components/branch/components/WhatsOnCard'

type BranchWhatsOnSectionProps = {
  title?: string | null
  branchSlug?: string | null
  themeColor?: {
    bgColor: string
    color: string
  } | null
  buttonColor?: string | null
  cards: {
    id: number
    title: string
    link: string
    media: {
      src: string
      alt: string
    }
    date?: string | null
    time?: string | null
    mainTag?: string | null
    subTags: string[]
    highlightText?: string | null
  }[]
}

export default function BranchWhatsOnSection({
  title,
  branchSlug,
  themeColor,
  buttonColor,
  cards,
}: BranchWhatsOnSectionProps) {
  return (
    <CardSection
      scInnerClassName="pc-t-100 pc-b-100 mb-t-75 mb-b-75"
      sectionClassName="branch-landing-whats-on dark-bg"
      title={title}
      cards={cards}
      getCardKey={(card) => card.id}
      renderCard={(card) => (
        <WhatsOnCard branchSlug={branchSlug} themeColor={themeColor} {...card} />
      )}
      cta={
        branchSlug
          ? {
              label: "WHAT'S ON",
              href: `/${branchSlug}/whats-on`,
              buttonColor: buttonColor ?? undefined,
            }
          : undefined
      }
    />
  )
}
