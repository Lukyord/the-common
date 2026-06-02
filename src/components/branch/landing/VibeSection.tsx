'use client'

import { useEffect, useMemo, useState } from 'react'

import type { Branch } from '@/payload-types'
import { resolveMedia } from '@/lib/resolveMedia'
import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import { CSSProperties } from 'react'

type VibeSectionProps = {
  data?: Branch['vibesCheck'] | null
}

const FADE_OUT_DURATION_MS = 200
const FADE_IN_DURATION_MS = 400

export default function VibeSection({ data }: VibeSectionProps) {
  const gallery = data?.gallery?.filter((item) => item?.day?.media || item?.night?.media) || []
  const [selectedIsNight, setSelectedIsNight] = useState(false)
  const [displayedIsNight, setDisplayedIsNight] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [displayedIndex, setDisplayedIndex] = useState(0)
  const [transitionState, setTransitionState] = useState<'idle' | 'fading-out' | 'fading-in'>(
    'idle',
  )

  const activeItem = gallery[displayedIndex]
  const targetMedia = useMemo(
    () => resolveMedia(displayedIsNight ? activeItem?.night?.media : activeItem?.day?.media),
    [activeItem, displayedIsNight],
  )
  const targetMediaMobile = useMemo(
    () =>
      resolveMedia(
        displayedIsNight ? activeItem?.night?.mediaMobile : activeItem?.day?.mediaMobile,
      ),
    [activeItem, displayedIsNight],
  )

  useEffect(() => {
    const hasPendingChange =
      selectedIndex !== displayedIndex || selectedIsNight !== displayedIsNight
    if (transitionState === 'idle' && hasPendingChange) {
      setTransitionState('fading-out')
    }
  }, [selectedIndex, displayedIndex, selectedIsNight, displayedIsNight, transitionState])

  useEffect(() => {
    if (transitionState === 'fading-out') {
      const timeout = window.setTimeout(() => {
        setDisplayedIndex(selectedIndex)
        setDisplayedIsNight(selectedIsNight)
        setTransitionState('fading-in')
      }, FADE_OUT_DURATION_MS)
      return () => window.clearTimeout(timeout)
    }

    if (transitionState === 'fading-in') {
      const timeout = window.setTimeout(() => {
        const hasPendingChange =
          selectedIndex !== displayedIndex || selectedIsNight !== displayedIsNight
        setTransitionState(hasPendingChange ? 'fading-out' : 'idle')
      }, FADE_IN_DURATION_MS)
      return () => window.clearTimeout(timeout)
    }

    return undefined
  }, [transitionState, selectedIndex, displayedIndex, selectedIsNight, displayedIsNight])

  useEffect(() => {
    if (!gallery.length) return
    if (selectedIndex >= gallery.length) setSelectedIndex(0)
    if (displayedIndex >= gallery.length) setDisplayedIndex(0)
  }, [gallery.length, selectedIndex, displayedIndex])

  if (!data?.title && !gallery.length) return null
  if (!gallery.length || !targetMedia?.src) return null

  const scMediaClassName = `sc-media cover ${
    transitionState === 'fading-out'
      ? 'is-fading-out'
      : transitionState === 'fading-in'
        ? 'is-fading-in'
        : ''
  }`.trim()

  return (
    <section
      data-section="vibe"
      className="branch-vibe"
      style={
        {
          '--primary-color': data.primaryColor,
          '--secondary-color': data.secondaryColor,
        } as CSSProperties
      }
    >
      <div className={scMediaClassName} aria-hidden>
        <RenderMedia
          key={`${targetMedia.src}-${targetMediaMobile?.src || targetMedia.src}`}
          src={targetMedia.src}
          srcMobile={targetMediaMobile?.src || targetMedia.src}
          alt={targetMedia.alt || activeItem?.title || data?.title || ''}
        />
      </div>

      <div className="container">
        <div className="sc-header">
          {data?.title && (
            <div className="sc-ttl">
              <MarkdownContent
                as="h2"
                className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium uppercase"
              >
                {data.title}
              </MarkdownContent>
            </div>
          )}

          <div className="time-toggle-tab">
            <button
              type="button"
              className={`type-d-body-l type-m-body-s uppercase letter-spacing-002 time-toggle-btn ${selectedIsNight ? 'is-night' : 'is-day'}`}
              onClick={() => setSelectedIsNight((current) => !current)}
              aria-label={`Switch to ${selectedIsNight ? 'day' : 'night'}`}
            >
              {selectedIsNight ? 'Night' : 'Day'}
            </button>
          </div>
        </div>

        <div className="media-trigger-container">
          <div className="media-trigger-overflow" data-lenis-prevent>
            <div className="media-trigger-wrapper">
              {gallery.map((item, index) => (
                <button
                  key={item.id || `${item.title || 'scene'}-${index}`}
                  type="button"
                  className={`media-trigger-btn type-d-body-l type-m-body-m uppercase weight-medium letter-spacing-002 ${index === selectedIndex ? 'is-active' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  {item.title || `Scene ${index + 1}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
