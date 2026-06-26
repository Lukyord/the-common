import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'

import { getWhatsOnFanAnchor, WHATS_ON_FAN_ANCHOR, type FanAnchor } from './fanAnchorConfig'
import { getFanLayout, getInitialCardZIndex } from './getFanLayout'
import type { CardLayout, CardState } from './types'
import { onWindowResizeInstant } from '@/utils/utils'

const DRAG_THRESHOLD_PX = 8

type DragSession = {
  cardIndex: number
  originX: number
  originY: number
  x: number
  y: number
  startClientX: number
  startClientY: number
  hasMoved: boolean
}

export function useWhatsOnLandingCards(
  cardCount: number,
  playfieldRef: RefObject<HTMLElement | null>,
  options?: {
    onDraggingChange?: (isDragging: boolean) => void
  },
) {
  const onDraggingChange = options?.onDraggingChange
  const [fanAnchor, setFanAnchor] = useState<FanAnchor>(WHATS_ON_FAN_ANCHOR.pc)
  const [cardStates, setCardStates] = useState<CardState[]>([])
  const [cardZIndex, setCardZIndex] = useState<Partial<Record<number, number>>>({})
  const [dragSession, setDragSession] = useState<DragSession | null>(null)
  const [layoutsReady, setLayoutsReady] = useState(false)

  const dragRef = useRef<DragSession | null>(null)
  const zIndexCounterRef = useRef(cardCount)
  const hasInitializedLayouts = useRef(false)
  const lastPlayfieldSize = useRef({ width: 0, height: 0 })

  const bringCardToFront = useCallback(
    (cardIndex: number) => {
      setCardZIndex((prev) => {
        let maxZ = cardCount
        for (let i = 0; i < cardCount; i++) {
          maxZ = Math.max(maxZ, prev[i] ?? getInitialCardZIndex(i, cardCount))
        }
        const nextZ = maxZ + 1
        zIndexCounterRef.current = nextZ
        return { ...prev, [cardIndex]: nextZ }
      })
    },
    [cardCount],
  )

  useLayoutEffect(() => {
    zIndexCounterRef.current = Math.max(zIndexCounterRef.current, cardCount)
  }, [cardCount])

  const applyFanLayouts = useCallback(() => {
    const playfield = playfieldRef.current
    if (!playfield || cardCount === 0) return false

    const sizeEl = playfield.querySelector<HTMLElement>('.whats-on-landing-card-measure')
    if (!sizeEl) return false

    const pf = playfield.getBoundingClientRect()
    const cardRect = sizeEl.getBoundingClientRect()
    const width = cardRect.width
    const height = cardRect.height

    if (pf.width <= 0 || pf.height <= 0 || width <= 0 || height <= 0) return false

    lastPlayfieldSize.current = { width: pf.width, height: pf.height }

    setCardStates((prev) =>
      Array.from({ length: cardCount }, (_, index) => {
        const existing = prev[index]
        if (existing?.hasCustomLayout) return existing

        return {
          layout: getFanLayout(index, cardCount, width, height, pf.width, pf.height, fanAnchor),
          hasCustomLayout: false,
          isFlipped: existing?.isFlipped ?? false,
        }
      }),
    )

    return true
  }, [cardCount, playfieldRef, fanAnchor])

  useLayoutEffect(() => {
    const syncAnchor = () => {
      const next = getWhatsOnFanAnchor()
      setFanAnchor((prev) =>
        prev.xPercent === next.xPercent && prev.yPercent === next.yPercent ? prev : next,
      )
    }

    syncAnchor()
    return onWindowResizeInstant(syncAnchor, false)
  }, [])

  useLayoutEffect(() => {
    if (cardCount === 0) {
      hasInitializedLayouts.current = false
      setCardStates([])
      setLayoutsReady(false)
      return
    }

    if (hasInitializedLayouts.current) return

    let rafId = 0
    const tryInit = () => {
      if (hasInitializedLayouts.current) return
      if (applyFanLayouts()) {
        hasInitializedLayouts.current = true
        setLayoutsReady(true)
        return
      }
      rafId = requestAnimationFrame(tryInit)
    }

    tryInit()
    return () => cancelAnimationFrame(rafId)
  }, [cardCount, applyFanLayouts])

  useLayoutEffect(() => {
    if (!hasInitializedLayouts.current) return

    applyFanLayouts()
  }, [fanAnchor, applyFanLayouts])

  useLayoutEffect(() => {
    const playfield = playfieldRef.current
    if (!playfield || !layoutsReady) return

    const observer = new ResizeObserver(() => {
      const pf = playfield.getBoundingClientRect()
      const { width, height } = lastPlayfieldSize.current
      if (Math.abs(pf.width - width) < 2 && Math.abs(pf.height - height) < 2) return
      applyFanLayouts()
    })

    observer.observe(playfield)
    return () => observer.disconnect()
  }, [layoutsReady, playfieldRef, applyFanLayouts])

  const clearDragSession = useCallback(() => {
    dragRef.current = null
    setDragSession(null)
  }, [])

  const finishDrag = useCallback((session: DragSession) => {
    setCardStates((prev) => {
      const next = [...prev]
      const existing = next[session.cardIndex]
      next[session.cardIndex] = {
        ...existing,
        layout: {
          x: session.x,
          y: session.y,
          rotation: existing?.layout.rotation ?? 0,
        },
        hasCustomLayout: true,
      }
      return next
    })
  }, [])

  const handleCardClick = useCallback((cardIndex: number) => {
    setCardStates((prev) =>
      prev.map((state, index) => {
        if (index !== cardIndex) {
          return { ...state, isFlipped: false }
        }

        return {
          ...state,
          isFlipped: !state.isFlipped,
        }
      }),
    )
  }, [])

  useLayoutEffect(() => {
    if (!dragSession) return

    const onWindowPointerMove = (event: PointerEvent) => {
      const current = dragRef.current
      if (!current) return

      const deltaX = event.clientX - current.startClientX
      const deltaY = event.clientY - current.startClientY
      const hasMoved =
        current.hasMoved ||
        Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD_PX

      const next: DragSession = {
        ...current,
        x: current.originX + deltaX,
        y: current.originY + deltaY,
        hasMoved,
      }

      dragRef.current = next
      setDragSession(next)
    }

    const onWindowPointerUp = () => {
      const current = dragRef.current
      if (!current) return

      if (current.hasMoved) {
        finishDrag(current)
      } else {
        handleCardClick(current.cardIndex)
      }

      clearDragSession()
    }

    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp)
    window.addEventListener('pointercancel', onWindowPointerUp)

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerup', onWindowPointerUp)
      window.removeEventListener('pointercancel', onWindowPointerUp)
    }
  }, [dragSession, clearDragSession, finishDrag, handleCardClick])

  const onCardPointerDown = useCallback(
    (cardIndex: number) => (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0 || dragRef.current) return
      event.preventDefault()

      const layout = cardStates[cardIndex]?.layout
      if (!layout) return

      bringCardToFront(cardIndex)

      const session: DragSession = {
        cardIndex,
        originX: layout.x,
        originY: layout.y,
        x: layout.x,
        y: layout.y,
        startClientX: event.clientX,
        startClientY: event.clientY,
        hasMoved: false,
      }

      dragRef.current = session
      setDragSession(session)
    },
    [bringCardToFront, cardStates],
  )

  const getCardZIndex = useCallback(
    (cardIndex: number) => cardZIndex[cardIndex] ?? getInitialCardZIndex(cardIndex, cardCount),
    [cardZIndex, cardCount],
  )

  const getCardLayout = useCallback(
    (cardIndex: number): CardLayout | null => {
      const stored = cardStates[cardIndex]?.layout
      if (dragSession?.cardIndex === cardIndex) {
        return {
          x: dragSession.x,
          y: dragSession.y,
          rotation: stored?.rotation ?? 0,
        }
      }
      return stored ?? null
    },
    [dragSession, cardStates],
  )

  const isCardFlipped = useCallback(
    (cardIndex: number) => cardStates[cardIndex]?.isFlipped ?? false,
    [cardStates],
  )

  const isDragging = dragSession?.hasMoved ?? false

  useEffect(() => {
    onDraggingChange?.(isDragging)
  }, [isDragging, onDraggingChange])

  return {
    layoutsReady,
    isDragging,
    draggingCardIndex: dragSession?.hasMoved ? dragSession.cardIndex : null,
    getCardLayout,
    getCardZIndex,
    isCardFlipped,
    onCardPointerDown,
    handleCardClick,
    bringCardToFront,
  }
}
