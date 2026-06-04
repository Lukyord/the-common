'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'

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

  const defaultMediaIndex = findFirstIndex(groups, 'hasMedia')
  const defaultTitleIndex = findFirstIndex(groups, 'hasTitle')
  const defaultDescriptionIndex = findFirstIndex(groups, 'hasDescription')

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

    if (group.hasMedia && group.media?.src) {
      const currentSrc = mediaIndex >= 0 ? groups[mediaIndex]?.media?.src : undefined
      if (group.media.src !== currentSrc) {
        setMediaIndex(index)
      }
    }

    if (group.hasTitle && group.title) {
      const currentTitle = titleIndex >= 0 ? groups[titleIndex]?.title : undefined
      if (group.title !== currentTitle) {
        setTitleIndex(index)
      }
    }

    if (group.hasDescription && group.description) {
      const currentDescription =
        descriptionIndex >= 0 ? groups[descriptionIndex]?.description : undefined
      if (group.description !== currentDescription) {
        setDescriptionIndex(index)
      }
    }
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
                    {groups.map((group, index) =>
                      group.hasMedia && group.media?.src ? (
                        <div
                          key={group.id}
                          className={`media-slide ${safeMediaIndex === index ? 'is-active' : ''}`}
                          aria-hidden={safeMediaIndex !== index}
                        >
                          <RenderMedia src={group.media.src} alt={group.media.alt} />
                        </div>
                      ) : null,
                    )}
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
                    className="about-word-trigger letter-spacing-002 weight-medium"
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
