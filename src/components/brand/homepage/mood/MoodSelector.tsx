'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import type { MoodVendorPoolItem } from '@/components/brand/homepage/mood/mapMoodVendorCard'
import {
  collectMoodImageUrlsForLifestyle,
  preloadImages,
} from '@/components/brand/homepage/mood/moodImagePreload'
import type { HomeLifestyle } from '@/payload/queries/home'
import { MOBILE_BREAKPOINT } from '@/utils/utils'

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

function measureNaturalContentWidth(item: HTMLElement) {
  const clone = item.cloneNode(true) as HTMLElement
  clone.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;white-space:nowrap;width:max-content;max-width:none;'
  document.body.appendChild(clone)
  const width = clone.getBoundingClientRect().width
  document.body.removeChild(clone)
  return width
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
  const hasAppliedWidthRef = useRef(false)
  const skipMeasureIndexEffectRef = useRef(true)
  const [currentWidth, setCurrentWidth] = useState<number | null>(null)
  const [underlineWidth, setUnderlineWidth] = useState<number | null>(null)
  const [itemHeight, setItemHeight] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
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

  const computeCurrentSizes = useCallback(() => {
    const current = currentRef.current
    const track = trackRef.current
    const dropdown = dropdownRef.current
    if (!current || !track || !dropdown) return null

    const activeItem = track.querySelectorAll<HTMLParagraphElement>('.odometer__item')[measureIndex]
    if (!activeItem) return null

    const isMobileViewport = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
    const { paddingLeft, paddingRight } = getComputedStyle(current)
    const paddingX = parseFloat(paddingLeft) + parseFloat(paddingRight)
    const naturalContentWidth = measureNaturalContentWidth(activeItem)
    const naturalCurrentWidth = naturalContentWidth + paddingX

    let nextCurrentWidth = naturalCurrentWidth
    let nextUnderlineWidth = naturalContentWidth
    let nextIsTruncated = false

    if (isMobileViewport) {
      const moodSelector = dropdown.closest<HTMLElement>('.mood-selector')
      const label = moodSelector?.querySelector<HTMLElement>('.mood-selector__label')
      const trigger = dropdown.querySelector<HTMLElement>('.mood-selector__trigger')
      const icon = trigger?.querySelector<HTMLElement>('.icon')

      if (moodSelector && label && trigger) {
        const rowWidth = moodSelector.getBoundingClientRect().width
        const labelWidth = label.getBoundingClientRect().width
        const triggerStyle = getComputedStyle(trigger)
        const triggerGap = parseFloat(triggerStyle.columnGap || triggerStyle.gap) || 0
        const iconWidth = icon?.getBoundingClientRect().width ?? 0
        const maxCurrentWidth = rowWidth - labelWidth - iconWidth - triggerGap

        if (maxCurrentWidth > 0 && naturalCurrentWidth > maxCurrentWidth) {
          nextCurrentWidth = maxCurrentWidth
          nextUnderlineWidth = Math.max(0, maxCurrentWidth - paddingX)
          nextIsTruncated = true
        }
      }
    }

    return {
      currentWidth: nextCurrentWidth,
      underlineWidth: nextUnderlineWidth,
      isTruncated: nextIsTruncated,
    }
  }, [measureIndex])

  const applyCurrentSizes = useCallback(
    (deferTransition = false) => {
      const sizes = computeCurrentSizes()
      if (!sizes) return

      const apply = () => {
        setCurrentWidth(sizes.currentWidth)
        setUnderlineWidth(sizes.underlineWidth)
        setIsTruncated(sizes.isTruncated)
        hasAppliedWidthRef.current = true
      }

      const shouldDefer =
        deferTransition &&
        hasAppliedWidthRef.current &&
        window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches

      if (shouldDefer) {
        requestAnimationFrame(apply)
        return
      }

      apply()
    },
    [computeCurrentSizes],
  )

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
    hasAppliedWidthRef.current = false
    skipMeasureIndexEffectRef.current = true
  }, [lifestyles])

  useLayoutEffect(() => {
    const track = trackRef.current
    const firstItem = track?.querySelector<HTMLParagraphElement>('.odometer__item')
    if (firstItem) {
      setItemHeight(firstItem.offsetHeight)
    }
  }, [lifestyles, isLooping])

  useLayoutEffect(() => {
    applyCurrentSizes()

    const moodSelector = dropdownRef.current?.closest('.mood-selector')
    if (!moodSelector) return

    let frameId = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => applyCurrentSizes())
    })

    observer.observe(moodSelector)

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [applyCurrentSizes, lifestyles, trackItems.length])

  useEffect(() => {
    if (skipMeasureIndexEffectRef.current) {
      skipMeasureIndexEffectRef.current = false
      return
    }

    applyCurrentSizes(true)
  }, [measureIndex, applyCurrentSizes])

  useEffect(() => {
    if (!document.fonts?.ready) return

    document.fonts.ready.then(() => {
      applyCurrentSizes()
    })
  }, [applyCurrentSizes, lifestyles])

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
      className={`mood-selector__dropdown${isOpen ? ' is-open' : ''}${!hasSelection ? ' is-showcasing' : ''}${isTruncated ? ' is-truncated' : ''}`}
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
