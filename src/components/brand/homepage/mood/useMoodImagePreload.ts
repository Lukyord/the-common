'use client'

import { useEffect, useMemo, useRef } from 'react'

import type { MoodVendorCard, MoodVendorPoolItem } from '@/components/brand/homepage/mood/mapMoodVendorCard'
import {
  collectMoodImageUrls,
  preloadImages,
} from '@/components/brand/homepage/mood/moodImagePreload'

type UseMoodImagePreloadOptions = {
  vendorPool: MoodVendorPoolItem[]
  defaultVendors: MoodVendorCard[]
  rootMargin?: string
}

export function useMoodImagePreload({
  vendorPool,
  defaultVendors,
  rootMargin = '400px',
}: UseMoodImagePreloadOptions) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageUrls = useMemo(
    () => collectMoodImageUrls(vendorPool, defaultVendors),
    [vendorPool, defaultVendors],
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section || imageUrls.length === 0) return

    const preload = () => preloadImages(imageUrls)

    if (!('IntersectionObserver' in window)) {
      preload()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        preload()
        observer.disconnect()
      },
      { rootMargin },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [imageUrls, rootMargin])

  return sectionRef
}
