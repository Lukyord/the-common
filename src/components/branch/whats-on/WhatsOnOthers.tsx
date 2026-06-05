'use client'

import type { CSSProperties } from 'react'

import CardSection, { CardSectionProps } from '@/components/branch/CardSection'
import WhatsOnCard from '@/components/branch/components/whats-on-card/WhatsOnCard'
import type { WhatsOnCardProps } from '@/components/branch/components/whats-on-card/WhatsOnCard'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import Link from 'next/link'

type WhatsOnOthersProps = Omit<
  CardSectionProps<WhatsOnCardProps>,
  'slider' | 'renderCard' | 'getCardKey'
> & {
  branchSlug: string
  themeColor?: WhatsOnCardProps['themeColor']
  eventArchiveBackground?: string | null
}

export default function WhatsOnOthers({
  sectionStyle,
  title,
  branchSlug,
  themeColor,
  eventArchiveBackground,
  cards,
}: WhatsOnOthersProps) {
  return (
    <>
      <CardSection
        sectionClassName="whats-on-others dark-bg"
        sectionStyle={sectionStyle}
        scInnerClassName="pc-t-100 pc-b-100 mb-t-75 mb-b-75"
        title={title}
        cards={cards}
        slider={{ speed: 1000, navigation: true, pagination: { clickable: true } }}
        getCardKey={(card) => card.link ?? card.title}
        renderCard={(card) => (
          <WhatsOnCard
            branchSlug={branchSlug}
            themeColor={themeColor}
            {...card}
            backgroundColor={sectionStyle?.backgroundColor}
          />
        )}
      />

      <AnimateOnScroll triggerClass="fadeIn">
        <Link
          href={`/${branchSlug}/whats-on/archive`}
          className="banner-button"
          style={{ '--button-bg-color': eventArchiveBackground } as CSSProperties}
        >
          <p className="type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002">
            <span>EVENT ARCHIVE</span>
          </p>

          <i className="ic ic-body-arrow-right"></i>
        </Link>
      </AnimateOnScroll>
    </>
  )
}
