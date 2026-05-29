'use client'

import { useMemo, useState } from 'react'

import { MOOD_CARD_BRANCH_SLUGS } from '@/constants/moodBranches'
import type {
  MoodVendorCard,
  MoodVendorPoolItem,
} from '@/components/brand/homepage/mood/mapMoodVendorCard'
import { MoodCard } from '@/components/brand/homepage/mood/MoodCard'
import { MoodSelector } from '@/components/brand/homepage/mood/MoodSelector'
import {
  buildDefaultMoodCardSlots,
  pickMoodVendorsForLifestyle,
} from '@/components/brand/homepage/mood/pickMoodVendorsForLifestyle'
import { useMoodImagePreload } from '@/components/brand/homepage/mood/useMoodImagePreload'
import type { HomeLifestyle } from '@/payload/queries/home'
import type { Homepage } from '@/payload-types'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

const DEFAULT_COPY = {
  titleLineOne: 'WHAT ARE YOU IN THE',
  titleLineTwo: 'MOOD FOR?',
  preSentence: 'FEELING LIKE...',
} as const

type MoodSectionProps = {
  data?: Homepage['whatAreYouInTheMoodFor']
  lifestyles: HomeLifestyle[]
  defaultVendors: MoodVendorCard[]
  vendorPool: MoodVendorPoolItem[]
}

export const MoodSection = ({ data, lifestyles, defaultVendors, vendorPool }: MoodSectionProps) => {
  const titleLineOne = data?.titleLineOne?.trim() || DEFAULT_COPY.titleLineOne
  const titleLineTwo = data?.titleLineTwo?.trim() || DEFAULT_COPY.titleLineTwo
  const preSentence = data?.preSentence?.trim() || DEFAULT_COPY.preSentence
  const sectionRef = useMoodImagePreload({ vendorPool, defaultVendors })
  const [selectedLifestyleId, setSelectedLifestyleId] = useState<number | null>(null)

  const hasMoodSelection = selectedLifestyleId != null

  const cardSlots = useMemo(
    () =>
      hasMoodSelection
        ? pickMoodVendorsForLifestyle(vendorPool, selectedLifestyleId)
        : buildDefaultMoodCardSlots(defaultVendors),
    [defaultVendors, hasMoodSelection, selectedLifestyleId, vendorPool],
  )

  const hasCards = cardSlots.some(Boolean)

  return (
    <section
      ref={sectionRef}
      data-section="mood"
      className={hasMoodSelection ? 'is-mood-selected' : undefined}
      data-mood-id={hasMoodSelection ? selectedLifestyleId : undefined}
    >
      <div className="sc-inner pc-t-100 pc-b-100 mb-t-100 mb-b-100">
        <div className="container">
          <AnimateOnScroll triggerClass="fadeIn" className="sc-header">
            <h2 className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium">
              {titleLineOne}
            </h2>

            <div className="mood-selector">
              <p className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium">
                {titleLineTwo}
              </p>
              <p className="mood-selector__label type-d-title type-m-title letter-spacing-003 weight-medium">
                {preSentence}
              </p>
              <MoodSelector
                lifestyles={lifestyles}
                vendorPool={vendorPool}
                selectedLifestyleId={selectedLifestyleId}
                onLifestyleSelect={setSelectedLifestyleId}
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll triggerClass="fadeIn" className="content">
            {hasCards &&
              MOOD_CARD_BRANCH_SLUGS.map((branchSlug, index) => {
                const vendor = cardSlots[index]

                if (!vendor) {
                  return (
                    <div key={branchSlug} data-card="mood" className="card is-empty" aria-hidden />
                  )
                }

                return (
                  <MoodCard
                    key={branchSlug}
                    contentKey={vendor.id}
                    media={vendor.media}
                    title={vendor.title}
                    link={vendor.link}
                    branch={hasMoodSelection ? vendor.branch : undefined}
                    priority={!hasMoodSelection}
                  />
                )
              })}
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
