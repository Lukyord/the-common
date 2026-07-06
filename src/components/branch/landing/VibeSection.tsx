'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Branch } from '@/payload-types'
import { resolveMedia } from '@/lib/resolveMedia'
import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import { CSSProperties } from 'react'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

type VibeSectionProps = {
  data?: Branch['vibesCheck'] | null
}

type MediaLayer = {
  key: string
  index: number
  isNight: boolean
  media: { src: string; alt: string }
  mediaMobile?: { src: string; alt: string }
  alt: string
}

function VibeMediaLayer({
  isActive,
  priority,
  ...mediaProps
}: {
  isActive: boolean
  priority?: boolean
  src: string
  srcMobile?: string
  alt?: string
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
    <div ref={layerRef} className={`sc-media-layer${isActive ? ' is-active' : ''}`}>
      <RenderMedia {...mediaProps} priority={priority} />
    </div>
  )
}

export default function VibeSection({ data }: VibeSectionProps) {
  const gallery = useMemo(
    () => data?.gallery?.filter((item) => item?.day?.media || item?.night?.media) || [],
    [data?.gallery],
  )
  const [selectedIsNight, setSelectedIsNight] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const mediaLayers = useMemo(() => {
    const layers: MediaLayer[] = []

    gallery.forEach((item, index) => {
      const dayMedia = resolveMedia(item.day?.media)
      const nightMedia = resolveMedia(item.night?.media)
      const dayMediaMobile = resolveMedia(item.day?.mediaMobile)
      const nightMediaMobile = resolveMedia(item.night?.mediaMobile)
      const fallbackAlt = item.title || data?.title || ''

      if (dayMedia?.src) {
        layers.push({
          key: `${index}-day`,
          index,
          isNight: false,
          media: dayMedia,
          mediaMobile: dayMediaMobile,
          alt: dayMedia.alt || fallbackAlt,
        })
      }

      if (nightMedia?.src) {
        layers.push({
          key: `${index}-night`,
          index,
          isNight: true,
          media: nightMedia,
          mediaMobile: nightMediaMobile,
          alt: nightMedia.alt || fallbackAlt,
        })
      }
    })

    return layers
  }, [gallery, data?.title])

  useEffect(() => {
    if (!gallery.length) return
    if (selectedIndex >= gallery.length) setSelectedIndex(0)
  }, [gallery.length, selectedIndex])

  if (!data?.title && !gallery.length) return null
  if (!gallery.length || !mediaLayers.length) return null

  return (
    <section
      data-section="vibe"
      className="branch-vibe"
      style={
        {
          '--title-color': data.titleColor,
          '--title-bg-color': data.titleBgColor,
          '--primary-color': data.primaryColor,
          '--secondary-color': data.secondaryColor,
        } as CSSProperties
      }
    >
      <div className="sc-media cover" aria-hidden>
        {mediaLayers.map((layer, layerIndex) => {
          const isActive = layer.index === selectedIndex && layer.isNight === selectedIsNight

          return (
            <VibeMediaLayer
              key={layer.key}
              isActive={isActive}
              priority={layerIndex === 0}
              src={layer.media.src}
              srcMobile={layer.mediaMobile?.src || layer.media.src}
              alt={layer.alt}
            />
          )
        })}
      </div>

      <div className="container">
        <div className="sc-header">
          {data?.title && (
            <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h2"
                className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium uppercase"
              >
                {data.title}
              </MarkdownContent>
            </AnimateOnScroll>
          )}

          <AnimateOnScroll triggerClass="fadeIn" className="time-toggle-tab">
            <button
              type="button"
              className={`type-d-body-l type-m-body-s uppercase letter-spacing-002 time-toggle-btn ${selectedIsNight ? 'is-night' : 'is-day'}`}
              onClick={() => setSelectedIsNight((current) => !current)}
              aria-label={`Switch to ${selectedIsNight ? 'day' : 'night'}`}
            >
              {selectedIsNight ? 'Night' : 'Day'}
            </button>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll triggerClass="fadeIn" className="media-trigger-container">
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
        </AnimateOnScroll>
      </div>
    </section>
  )
}
