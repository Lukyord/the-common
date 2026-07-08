'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { Branch } from '@/payload-types'
import {
  BRANCH_ABOUT_WORDS_BY_SLUG,
  getBranchAboutWordLabel,
  type BranchAboutWord,
} from '@/constants/branchAboutWords'
import { resolveMedia } from '@/lib/resolveMedia'
import RenderMedia from '@/components/common/media'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import { useIsMobile } from '@/components/branch/vendors/VendorMap/hooks/useIsMobile'

const MOBILE_ROTATE_INTERVAL_MS = 2500

type AboutSectionProps = {
  data?: Branch['about'] | null
  branchSlug?: string | null
}

type WordGroupRow = NonNullable<NonNullable<Branch['about']>['wordGroups']>[number]

type ResolvedWordGroup = {
  id: string
  word: BranchAboutWord
  label: string
  media?: { src: string; alt: string }
  hasMedia: boolean
  title?: string
  hasTitle: boolean
  description?: string
  hasDescription: boolean
}

function AboutMediaLayer({
  isActive,
  priority,
  src,
  alt,
}: {
  isActive: boolean
  priority?: boolean
  src: string
  alt: string
}) {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const videos = layerRef.current?.querySelectorAll('video')
    videos?.forEach((video) => {
      if (isActive) {
        void video.play().catch((): void => undefined)
      } else {
        video.pause()
      }
    })
  }, [isActive])

  return (
    <div
      ref={layerRef}
      className={`media-slide${isActive ? ' is-active' : ''}`}
      aria-hidden={!isActive}
    >
      <RenderMedia src={src} alt={alt} priority={priority} />
    </div>
  )
}

function getWordGroupsForBranch(
  wordGroups: WordGroupRow[] | null | undefined,
  branchSlug?: string | null,
): WordGroupRow[] {
  if (!wordGroups?.length) return []

  const expected = branchSlug ? BRANCH_ABOUT_WORDS_BY_SLUG[branchSlug] : undefined
  if (!expected) return wordGroups

  return expected
    .map((word) => wordGroups.find((row) => row.word === word))
    .filter((row): row is WordGroupRow => Boolean(row))
}

function resolveWordGroups(groups: WordGroupRow[]): ResolvedWordGroup[] {
  return groups.map((group, index) => {
    const media = resolveMedia(group.media)
    const title = group.title?.trim()
    const description = group.description?.trim()

    return {
      id: group.id ?? `${group.word}-${index}`,
      word: group.word as BranchAboutWord,
      label: getBranchAboutWordLabel(group.word as BranchAboutWord),
      media,
      hasMedia: Boolean(media?.src),
      title,
      hasTitle: Boolean(title),
      description,
      hasDescription: Boolean(description),
    }
  })
}

function findFirstIndex(groups: ResolvedWordGroup[], key: 'hasMedia' | 'hasTitle' | 'hasDescription') {
  return groups.findIndex((group) => group[key])
}

export default function AboutSection({ data, branchSlug }: AboutSectionProps) {
  const groups = useMemo(
    () => resolveWordGroups(getWordGroupsForBranch(data?.wordGroups, branchSlug)),
    [data?.wordGroups, branchSlug],
  )

  const mediaLayers = useMemo(
    () =>
      groups
        .map((group, index) => ({ group, index }))
        .filter(
          (entry): entry is { group: ResolvedWordGroup & { media: { src: string; alt: string } }; index: number } =>
            Boolean(entry.group.hasMedia && entry.group.media?.src),
        ),
    [groups],
  )

  const defaultMediaIndex = findFirstIndex(groups, 'hasMedia')
  const defaultTitleIndex = findFirstIndex(groups, 'hasTitle')
  const defaultDescriptionIndex = findFirstIndex(groups, 'hasDescription')

  const isMobile = useIsMobile()

  const [hoveredIndex, setHoveredIndex] = useState(0)
  const [mediaIndex, setMediaIndex] = useState(defaultMediaIndex)
  const [titleIndex, setTitleIndex] = useState(defaultTitleIndex)
  const [descriptionIndex, setDescriptionIndex] = useState(defaultDescriptionIndex)

  useEffect(() => {
    setMediaIndex(defaultMediaIndex)
    setTitleIndex(defaultTitleIndex)
    setDescriptionIndex(defaultDescriptionIndex)
    setHoveredIndex(0)
  }, [defaultMediaIndex, defaultTitleIndex, defaultDescriptionIndex, groups])

  useEffect(() => {
    if (!isMobile || groups.length <= 1) return

    const interval = window.setInterval(() => {
      setHoveredIndex((prev) => {
        const next = (prev + 1) % groups.length
        const group = groups[next]
        if (group?.hasMedia) setMediaIndex(next)
        if (group?.hasTitle) setTitleIndex(next)
        if (group?.hasDescription) setDescriptionIndex(next)
        return next
      })
    }, MOBILE_ROTATE_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [isMobile, groups])

  const hasContent = Boolean(
    data?.bgColor ||
      groups.some((group) => group.hasMedia || group.hasTitle || group.hasDescription),
  )

  if (!hasContent) return null

  const safeHoveredIndex = hoveredIndex < groups.length ? hoveredIndex : 0
  const safeMediaIndex = mediaIndex >= 0 ? mediaIndex : defaultMediaIndex
  const safeTitleIndex = titleIndex >= 0 ? titleIndex : defaultTitleIndex
  const safeDescriptionIndex =
    descriptionIndex >= 0 ? descriptionIndex : defaultDescriptionIndex

  const hasMedia = defaultMediaIndex >= 0

  const handleWordHover = (index: number) => {
    setHoveredIndex(index)

    const group = groups[index]
    if (!group) return

    if (group.hasMedia) setMediaIndex(index)
    if (group.hasTitle) setTitleIndex(index)
    if (group.hasDescription) setDescriptionIndex(index)
  }

  return (
    <section
      data-section="about-section"
      className="branch-about"
      style={data?.bgColor ? ({ '--about-bg-color': data.bgColor } as CSSProperties) : undefined}
    >
      <div className="sc-inner pc-t-75 pc-b-75 mb-t-75 mb-b-75">
        <div className="container">
          <div className="media-content">
            {hasMedia && (
              <AnimateOnScroll triggerClass="fadeIn" className="media">
                <div className="cover">
                  <RenderMedia
                    src="/designs/branch-landing-frame.webp"
                    srcMobile="/designs/branch-landing-frame.webp"
                    alt="Branch Landing Frame"
                  />
                  <div className="clip-double-rect">
                    {mediaLayers.map(({ group, index }, layerIndex) => (
                      <AboutMediaLayer
                        key={group.id}
                        isActive={safeMediaIndex === index}
                        priority={layerIndex === 0}
                        src={group.media.src}
                        alt={group.media.alt}
                      />
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
            )}
            {groups.length > 0 && (
              <div className={branchSlug ? `words branch-${branchSlug}` : 'words'}>
                {groups.map((group, index) => (
                  <AnimateOnScroll
                    triggerClass="fadeIn"
                    key={group.id}
                    className={`about-word-trigger letter-spacing-002 weight-medium${isMobile && safeHoveredIndex === index ? ' is-hovered' : ''}`}
                    data-word={group.word}
                    onMouseEnter={() => handleWordHover(index)}
                    onFocus={() => handleWordHover(index)}
                    aria-pressed={safeHoveredIndex === index}
                  >
                    {group.label}
                  </AnimateOnScroll>
                ))}
              </div>
            )}
          </div>
          <div className="sc-header">
            {defaultTitleIndex >= 0 && (
              <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
                <div className="about-content-stack">
                  {groups.map(
                    (group, index) =>
                      group.hasTitle &&
                      group.title && (
                        <div
                          key={`${group.id}-title`}
                          className={`content-slide ${safeTitleIndex === index ? 'is-active' : ''}`}
                          aria-hidden={safeTitleIndex !== index}
                        >
                          <MarkdownContent
                            as="h2"
                            className="type-d-header type-m-headliner-m weight-medium letter-spacing-002"
                          >
                            {group.title}
                          </MarkdownContent>
                        </div>
                      ),
                  )}
                </div>
              </AnimateOnScroll>
            )}
            {defaultDescriptionIndex >= 0 && (
              <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-desc">
                <div className="about-content-stack">
                  {groups.map(
                    (group, index) =>
                      group.hasDescription &&
                      group.description && (
                        <div
                          key={`${group.id}-description`}
                          className={`content-slide ${safeDescriptionIndex === index ? 'is-active' : ''}`}
                          aria-hidden={safeDescriptionIndex !== index}
                        >
                          <MarkdownContent
                            as="p"
                            className="type-d-body-m type-m-body-s letter-spacing-002"
                          >
                            {group.description}
                          </MarkdownContent>
                        </div>
                      ),
                  )}
                </div>
              </AnimateOnScroll>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
