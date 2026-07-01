'use client'

import CardSection, { CardSectionProps } from '@/components/branch/CardSection'
import WhatsOnCard, {
  WhatsOnCardProps,
} from '@/components/branch/components/whats-on-card/WhatsOnCard'

type WhatsOnClubProps = CardSectionProps<WhatsOnCardProps> & {
  themeColor?: WhatsOnCardProps['themeColor']
}

export default function WhatsOnClub({
  sectionClassName,
  scInnerClassName,
  title,
  themeColor,
  cards,
  cta,
}: WhatsOnClubProps) {
  if (cards.length === 0) {
    return null
  }

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
          themeColor={themeColor}
          {...card}
          backgroundColor="var(--color-dark-brown)"
        />
      )}
      cta={cta}
    />
  )
}
