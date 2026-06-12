'use client'

import CardSection, { CardSectionProps } from '@/components/branch/CardSection'
import WhatsOnCard from '@/components/branch/components/whats-on-card/WhatsOnCard'
import type { WhatsOnCardProps } from '@/components/branch/components/whats-on-card/WhatsOnCard'

type BranchWhatsOnSectionProps = Omit<
  CardSectionProps<WhatsOnCardProps>,
  'sectionClassName' | 'scInnerClassName' | 'cta' | 'renderCard' | 'getCardKey'
> & {
  branchSlug?: string | null
  themeColor?: WhatsOnCardProps['themeColor'] | null
  buttonColor?: string | null
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
      getCardKey={(card) => card.title}
      slider={{ pagination: true }}
      renderCard={(card) => (
        <WhatsOnCard
          branchSlug={branchSlug}
          themeColor={themeColor}
          {...card}
          backgroundColor="var(--color-dark-brown)"
        />
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
