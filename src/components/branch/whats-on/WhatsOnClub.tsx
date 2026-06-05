'use client'

import CardSection, { CardSectionProps } from '@/components/branch/CardSection'
import WhatsOnCard, {
  WhatsOnCardProps,
} from '@/components/branch/components/whats-on-card/WhatsOnCard'

export default function WhatsOnClub({
  sectionClassName,
  scInnerClassName,
  title,
  cards,
  cta,
}: CardSectionProps<WhatsOnCardProps>) {
  return (
    <CardSection
      scInnerClassName={scInnerClassName}
      sectionClassName={sectionClassName}
      title={title}
      cards={cards}
      getCardKey={(card) => card.title}
      renderCard={(card) => (
        <WhatsOnCard
          branchSlug={card.branchSlug}
          themeColor={card.themeColor}
          {...card}
          backgroundColor="var(--color-dark-brown)"
        />
      )}
      cta={cta}
    />
  )
}
