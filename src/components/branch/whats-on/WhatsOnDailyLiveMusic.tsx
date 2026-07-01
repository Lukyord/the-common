'use client'

import CardSection, { CardSectionProps } from '@/components/branch/CardSection'
import WhatsOnImageCard, {
  WhatsOnImageCardProps,
} from '@/components/branch/components/whats-on-image-card/WhatsOnImageCard'
import FancyboxGallery from '@/components/common/fancybox/FancyboxGallery'

const DAILY_LIVE_MUSIC_FANCYBOX_GROUP = 'daily-live-music'

type WhatsOnDailyLiveMusicProps = Omit<
  CardSectionProps<WhatsOnImageCardProps>,
  'slider' | 'renderCard' | 'getCardKey'
>

export default function WhatsOnDailyLiveMusic({
  sectionClassName,
  scInnerClassName,
  title,
  cards,
}: WhatsOnDailyLiveMusicProps) {
  if (cards.length === 0) return null

  return (
    <FancyboxGallery fancyboxClass="daily-live-music-gallery">
      <CardSection
        sectionClassName={sectionClassName}
        scInnerClassName={scInnerClassName}
        title={title}
        cards={cards}
        slider={{ speed: 1000, navigation: true }}
        getCardKey={(card) => card.media?.src ?? ''}
        renderCard={(card) => (
          <WhatsOnImageCard {...card} fancyboxGroup={DAILY_LIVE_MUSIC_FANCYBOX_GROUP} />
        )}
      />
    </FancyboxGallery>
  )
}
