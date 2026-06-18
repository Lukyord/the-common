'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

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
import { MOBILE_BREAKPOINT } from '@/utils/utils'

const DEFAULT_COPY = {
  titleLineOne: 'WHAT ARE YOU IN THE',
  titleLineTwo: 'MOOD FOR?',
  preSentence: "I'M FEELING LIKE...",
  preSentenceMobile: 'FEELING LIKE...',
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
  const preSentenceMobile = data?.preSentenceMobile?.trim() || DEFAULT_COPY.preSentence
  const sectionRef = useMoodImagePreload({ vendorPool, defaultVendors })
  const contentWrapperRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    const wrapper = contentWrapperRef.current
    if (!wrapper || !hasCards) return

    const scrollToCenter = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) return
      wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2
    }

    const frameId = requestAnimationFrame(scrollToCenter)
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)

    mediaQuery.addEventListener('change', scrollToCenter)
    window.addEventListener('resize', scrollToCenter)

    return () => {
      cancelAnimationFrame(frameId)
      mediaQuery.removeEventListener('change', scrollToCenter)
      window.removeEventListener('resize', scrollToCenter)
    }
  }, [hasCards, hasMoodSelection, selectedLifestyleId])

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
                <span className="show-md"> {preSentence}</span>
                <span className="hidden-device-md">{preSentenceMobile}</span>
              </p>
              <MoodSelector
                lifestyles={lifestyles}
                vendorPool={vendorPool}
                selectedLifestyleId={selectedLifestyleId}
                onLifestyleSelect={setSelectedLifestyleId}
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll triggerClass="fadeIn">
            <div className="content-wrapper" ref={contentWrapperRef}>
              <div className="content">
              {hasCards &&
                MOOD_CARD_BRANCH_SLUGS.map((branchSlug, index) => {
                  const vendor = cardSlots[index]

                  if (!vendor) {
                    return (
                      <div
                        key={branchSlug}
                        data-card="mood"
                        className="card is-empty"
                        aria-hidden
                      />
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
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
