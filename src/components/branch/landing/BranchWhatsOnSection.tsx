'use client'

import CardSection from '@/components/branch/CardSection'
import WhatsOnCard from '@/components/branch/components/WhatsOnCard'

type BranchWhatsOnSectionProps = {
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
  buttonColor,
  cards,
}: BranchWhatsOnSectionProps) {
  return (
    <CardSection
      scInnerClassName="pc-t-100 pc-b-100 mb-t-75 mb-b-75"
      sectionClassName="branch-landing-whats-on"
      title={title}
      cards={cards}
      getCardKey={(card) => card.id}
      renderCard={(card) => (
        <WhatsOnCard
          title={card.title}
          media={card.media}
          date={card.date}
          time={card.time}
          mainTag={card.mainTag}
          subTags={card.subTags}
          highlightText={card.highlightText}
          link={card.link}
        />
      )}
      cta={
        branchSlug
          ? {
              label: "WHAT'S ON",
              href: `/${branchSlug}/event`,
              buttonColor: buttonColor ?? undefined,
            }
          : undefined
      }
    />
  )
}
