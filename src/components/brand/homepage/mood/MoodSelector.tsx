'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import type { MoodVendorPoolItem } from '@/components/brand/homepage/mood/mapMoodVendorCard'
import {
  collectMoodImageUrlsForLifestyle,
  preloadImages,
} from '@/components/brand/homepage/mood/moodImagePreload'
import type { HomeLifestyle } from '@/payload/queries/home'

const SHOWCASE_INTERVAL_MS = 2000
const TRACK_TRANSITION_MS = 700

type MoodSelectorProps = {
  lifestyles: HomeLifestyle[]
  vendorPool: MoodVendorPoolItem[]
  selectedLifestyleId: number | null
  onLifestyleSelect: (id: number) => void
}

function buildTrackItems(lifestyles: HomeLifestyle[], loop: boolean) {
  if (!loop || lifestyles.length <= 1) return lifestyles
  return [...lifestyles, lifestyles[0]]
}

export const MoodSelector = ({
  lifestyles,
  vendorPool,
  selectedLifestyleId,
  onLifestyleSelect,
}: MoodSelectorProps) => {
  const listboxId = useId()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const trackIndexRef = useRef(0)
  const isResettingRef = useRef(false)
  const [currentWidth, setCurrentWidth] = useState<number | null>(null)
  const [underlineWidth, setUnderlineWidth] = useState<number | null>(null)
  const [itemHeight, setItemHeight] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showcaseIndex, setShowcaseIndex] = useState(0)
  const [trackIndex, setTrackIndex] = useState(0)

  const hasSelection = selectedLifestyleId !== null
  const selectedIndex = lifestyles.findIndex(({ id }) => id === selectedLifestyleId)
  const isLooping = !hasSelection && lifestyles.length > 1
  const trackItems = buildTrackItems(lifestyles, isLooping)
  const cloneIndex = isLooping ? lifestyles.length : -1

  const transformIndex = hasSelection && selectedIndex >= 0 ? selectedIndex : trackIndex
  const measureIndex =
    hasSelection && selectedIndex >= 0
      ? selectedIndex
      : trackIndex === cloneIndex
        ? 0
        : showcaseIndex

  const displayText = lifestyles[measureIndex]?.text

  const resetTrackToStart = useCallback(() => {
    const track = trackRef.current
    if (!track || isResettingRef.current) return

    isResettingRef.current = true
    track.classList.add('is-resetting')
    trackIndexRef.current = 0
    setTrackIndex(0)
    setShowcaseIndex(0)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.classList.remove('is-resetting')
        isResettingRef.current = false
      })
    })
  }, [])

  useEffect(() => {
    trackIndexRef.current = trackIndex
  }, [trackIndex])

  useEffect(() => {
    setShowcaseIndex(0)
    setTrackIndex(0)
    trackIndexRef.current = 0
  }, [lifestyles])

  useLayoutEffect(() => {
    const track = trackRef.current
    const firstItem = track?.querySelector<HTMLParagraphElement>('.odometer__item')
    if (firstItem) {
      setItemHeight(firstItem.offsetHeight)
    }
  }, [lifestyles, isLooping])

  useLayoutEffect(() => {
    const current = currentRef.current
    const track = trackRef.current
    if (!current || !track) return

    const activeItem = track.querySelectorAll<HTMLParagraphElement>('.odometer__item')[measureIndex]
    if (!activeItem) return

    const { paddingLeft, paddingRight } = getComputedStyle(current)
    const paddingX = parseFloat(paddingLeft) + parseFloat(paddingRight)

    setCurrentWidth(activeItem.scrollWidth + paddingX)
    setUnderlineWidth(activeItem.scrollWidth)
  }, [measureIndex, lifestyles, trackItems.length])

  useEffect(() => {
    if (!isLooping) return

    const track = trackRef.current
    if (!track) return

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== 'transform') return
      if (trackIndexRef.current !== cloneIndex) return

      resetTrackToStart()
    }

    track.addEventListener('transitionend', handleTransitionEnd)
    return () => track.removeEventListener('transitionend', handleTransitionEnd)
  }, [isLooping, cloneIndex, resetTrackToStart])

  useEffect(() => {
    if (!isLooping || trackIndex !== cloneIndex) return

    const timeoutId = window.setTimeout(() => {
      if (trackIndexRef.current === cloneIndex) {
        resetTrackToStart()
      }
    }, TRACK_TRANSITION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isLooping, trackIndex, cloneIndex, resetTrackToStart])

  useEffect(() => {
    if (!isLooping) return

    const recoverStuckTrack = () => {
      if (trackIndexRef.current >= lifestyles.length) {
        resetTrackToStart()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        recoverStuckTrack()
      }
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        recoverStuckTrack()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [isLooping, lifestyles.length, resetTrackToStart])

  useEffect(() => {
    if (hasSelection || isOpen || lifestyles.length <= 1) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const interval = window.setInterval(() => {
      if (prefersReducedMotion) {
        setShowcaseIndex((index) => {
          const next = (index + 1) % lifestyles.length
          setTrackIndex(next)
          return next
        })
        return
      }

      setTrackIndex((prev) => {
        if (prev >= cloneIndex) {
          setShowcaseIndex(0)
          return 0
        }

        const lastIndex = lifestyles.length - 1

        if (prev === lastIndex) {
          setShowcaseIndex(0)
          return cloneIndex
        }

        const next = prev + 1
        setShowcaseIndex(next)
        return next
      })
    }, SHOWCASE_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [hasSelection, isOpen, lifestyles.length, cloneIndex])

  useEffect(() => {
    if (!isOpen) return

    for (const { id } of lifestyles) {
      preloadImages(collectMoodImageUrlsForLifestyle(vendorPool, id))
    }
  }, [isOpen, lifestyles, vendorPool])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  if (!lifestyles.length) {
    return null
  }

  const handleSelect = (id: number) => {
    preloadImages(collectMoodImageUrlsForLifestyle(vendorPool, id))
    onLifestyleSelect(id)
    setIsOpen(false)
  }

  const handleOptionPreload = (id: number) => {
    preloadImages(collectMoodImageUrlsForLifestyle(vendorPool, id))
  }

  return (
    <div
      ref={dropdownRef}
      className={`mood-selector__dropdown${isOpen ? ' is-open' : ''}${!hasSelection ? ' is-showcasing' : ''}`}
    >
      <button
        type="button"
        className="mood-selector__trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <div
          ref={currentRef}
          className="current"
          style={currentWidth != null ? { width: currentWidth } : undefined}
        >
          <div className="current__content">
            <div className="odometer" style={{ height: itemHeight ?? 0 }}>
              <div
                ref={trackRef}
                className="odometer__track"
                style={{
                  transform:
                    itemHeight != null
                      ? `translate3d(0, ${-transformIndex * itemHeight}px, 0)`
                      : undefined,
                }}
              >
                {trackItems.map(({ id, text }, index) => (
                  <p
                    key={index === cloneIndex ? `${id}-clone` : id}
                    className="odometer__item type-d-title type-m-title letter-spacing-003 weight-medium"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
            <span
              className="current__underline"
              style={underlineWidth != null ? { width: underlineWidth } : undefined}
              aria-hidden
            />
          </div>
          <span className="visually-hidden" aria-live="polite">
            {displayText}
          </span>
        </div>
        <div className="icon" aria-hidden>
          <i className="ic ic-chevron-down c-pink"></i>
        </div>
      </button>

      <div className="mood-selector__panel" data-hidden={!isOpen}>
        <ul id={listboxId} role="listbox" aria-label="Mood options">
          {lifestyles.map(({ id, text }) => (
            <li key={id} role="option" aria-selected={selectedLifestyleId === id}>
              <button
                type="button"
                className="type-d-title type-m-title letter-spacing-003 weight-medium"
                onMouseEnter={() => handleOptionPreload(id)}
                onFocus={() => handleOptionPreload(id)}
                onClick={() => handleSelect(id)}
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
