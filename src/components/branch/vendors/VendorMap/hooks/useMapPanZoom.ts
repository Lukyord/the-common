import { useEffect, useRef, type RefObject } from 'react'
import Panzoom from '@panzoom/panzoom'

import { MAP_START_SCALE } from '../lib/constants'

const SCROLL_END_DELAY_MS = 150

function canPageScroll(deltaY: number): boolean {
  const scrollElement = document.scrollingElement ?? document.documentElement
  const { scrollTop, scrollHeight, clientHeight } = scrollElement
  const tolerance = 1

  if (deltaY < 0) return scrollTop > tolerance
  if (deltaY > 0) return scrollTop + clientHeight < scrollHeight - tolerance
  return false
}

function isPinchZoom(event: WheelEvent): boolean {
  return event.ctrlKey || event.metaKey
}

type UseMapPanZoomOptions = {
  maxScale?: number
  minScale?: number
  startScale?: number
}

export function useMapPanZoom(
  viewportRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  options?: UseMapPanZoomOptions,
) {
  const panzoomRef = useRef<ReturnType<typeof Panzoom> | null>(null)

  useEffect(() => {
    const viewport = viewportRef.current
    const stage = stageRef.current
    if (!viewport || !stage) return

    const panzoom = Panzoom(stage, {
      canvas: true,
      startScale: options?.startScale ?? MAP_START_SCALE,
      maxScale: options?.maxScale ?? 4,
      minScale: options?.minScale ?? MAP_START_SCALE,
      excludeClass: 'map-plan-interactive',
    })

    panzoomRef.current = panzoom

    let isScrolling = false
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null

    const onScroll = () => {
      isScrolling = true
      if (scrollEndTimer) clearTimeout(scrollEndTimer)
      scrollEndTimer = setTimeout(() => {
        isScrolling = false
        scrollEndTimer = null
      }, SCROLL_END_DELAY_MS)
    }

    const onWheel = (event: WheelEvent) => {
      if (!isPinchZoom(event) && (isScrolling || canPageScroll(event.deltaY))) {
        return
      }

      panzoom.zoomWithWheel(event)
    }

    const onPanStart = () => {
      viewport.classList.add('is-grabbing')
    }

    const onPanEnd = () => {
      viewport.classList.remove('is-grabbing')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    viewport.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('panzoomstart', onPanStart)
    stage.addEventListener('panzoomend', onPanEnd)

    return () => {
      window.removeEventListener('scroll', onScroll)
      viewport.removeEventListener('wheel', onWheel)
      stage.removeEventListener('panzoomstart', onPanStart)
      stage.removeEventListener('panzoomend', onPanEnd)
      if (scrollEndTimer) clearTimeout(scrollEndTimer)
      panzoom.destroy()
      panzoomRef.current = null
    }
  }, [viewportRef, stageRef, options?.maxScale, options?.minScale, options?.startScale])

  return panzoomRef
}
