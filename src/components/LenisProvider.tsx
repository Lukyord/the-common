'use client'

import gsap from 'gsap'
import type { LenisOptions } from 'lenis'
import { ReactLenis, type LenisRef } from 'lenis/react'
import type { PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'

import ScrollRestoration from '@/components/ScrollRestoration'

const SCROLL_SHAPE_TRACK = '[data-section="scroll-shape"] .content-wrapper'

/** Shift+wheel reports on deltaY; remap so allowNestedScroll treats it as horizontal. */
const virtualScroll: NonNullable<LenisOptions['virtualScroll']> = (data) => {
  const { event } = data
  if (!(event instanceof WheelEvent) || !event.shiftKey) return true

  const track = event
    .composedPath()
    .find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.matches(SCROLL_SHAPE_TRACK),
    )
  if (!track) return true

  const horizontalDelta = Math.abs(data.deltaY) >= Math.abs(data.deltaX) ? data.deltaY : data.deltaX

  data.deltaX = horizontalDelta
  data.deltaY = 0

  return true
}

export default function LenisProvider({ children }: PropsWithChildren) {
  const lenisRef = useRef<LenisRef | null>(null)

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, allowNestedScroll: true, virtualScroll }}
      ref={lenisRef}
    >
      <ScrollRestoration />
      {children}
    </ReactLenis>
  )
}
