import { useEffect, useRef, type RefObject } from 'react'
import Panzoom from '@panzoom/panzoom'

type UseMapPanZoomOptions = {
  maxScale?: number
  minScale?: number
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
      maxScale: options?.maxScale ?? 4,
      minScale: options?.minScale ?? 1,
      excludeClass: 'map-plan-interactive',
    })

    panzoomRef.current = panzoom

    const onWheel = (event: WheelEvent) => {
      panzoom.zoomWithWheel(event)
    }

    const onPanStart = () => {
      viewport.classList.add('is-grabbing')
    }

    const onPanEnd = () => {
      viewport.classList.remove('is-grabbing')
    }

    viewport.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('panzoomstart', onPanStart)
    stage.addEventListener('panzoomend', onPanEnd)

    return () => {
      viewport.removeEventListener('wheel', onWheel)
      stage.removeEventListener('panzoomstart', onPanStart)
      stage.removeEventListener('panzoomend', onPanEnd)
      panzoom.destroy()
      panzoomRef.current = null
    }
  }, [viewportRef, stageRef, options?.maxScale, options?.minScale])

  return panzoomRef
}
