import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { flushSync } from 'react-dom'
import { getCompletedBingoLines } from './checkBingoLines'
import type { StampLayout } from './types'

const GRID_SIZE = 9
const STAMP_COUNT = 9

type DragState = {
  stampIndex: number
  fromCell: number | null
  offsetX: number
  offsetY: number
  width: number
  height: number
  x: number
  y: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function clientToPlayfield(clientX: number, clientY: number, playfield: HTMLElement) {
  const rect = playfield.getBoundingClientRect()
  return { x: clientX - rect.left, y: clientY - rect.top, rect }
}

function getSnappedCellLayout(
  cellIndex: number,
  playfield: HTMLElement,
  stampSize: Pick<StampLayout, 'width' | 'height'>,
): StampLayout | null {
  const cell = playfield.querySelector<HTMLElement>(`[data-cell-index="${cellIndex}"]`)
  if (!cell) return null

  const pf = playfield.getBoundingClientRect()
  const cr = cell.getBoundingClientRect()
  return {
    x: cr.left - pf.left + (cr.width - stampSize.width) / 2,
    y: cr.top - pf.top + (cr.height - stampSize.height) / 2,
    width: stampSize.width,
    height: stampSize.height,
  }
}

function getCellIndexFromPoint(
  clientX: number,
  clientY: number,
  playfield: HTMLElement | null,
): number | null {
  if (!playfield) return null

  const cells = playfield.querySelectorAll<HTMLElement>('.bingo-grid-item[data-cell-index]')
  for (const cell of cells) {
    const rect = cell.getBoundingClientRect()
    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
      const index = Number(cell.dataset.cellIndex)
      if (Number.isInteger(index) && index >= 0 && index < GRID_SIZE) return index
    }
  }

  return null
}

function getRandomPoolLayouts(
  pool: HTMLElement,
  playfield: HTMLElement,
  count: number,
): Partial<Record<number, StampLayout>> | null {
  const sizeEl = pool.querySelector<HTMLElement>('.bingo-stamps-pool-slot')
  if (!sizeEl) return null

  const pf = playfield.getBoundingClientRect()
  const poolRect = pool.getBoundingClientRect()
  const sizeRect = sizeEl.getBoundingClientRect()
  const width = sizeRect.width
  const height = sizeRect.height

  const poolX = poolRect.left - pf.left
  const poolY = poolRect.top - pf.top
  const maxX = Math.max(0, poolRect.width - width)
  const maxY = Math.max(0, poolRect.height - height)

  const layouts: Partial<Record<number, StampLayout>> = {}
  for (let index = 0; index < count; index++) {
    layouts[index] = {
      x: poolX + Math.random() * maxX,
      y: poolY + Math.random() * maxY,
      width,
      height,
    }
  }

  return layouts
}

type UseBingoDragOptions = {
  onPointerMove?: (clientX: number, clientY: number) => void
}

export function useBingoDrag(
  sectionRef: RefObject<HTMLElement | null>,
  playfieldRef: RefObject<HTMLElement | null>,
  options?: UseBingoDragOptions,
) {
  const onPointerMove = options?.onPointerMove
  const [cellStamps, setCellStamps] = useState<(number | null)[]>(() => Array(GRID_SIZE).fill(null))
  const [stampLayouts, setStampLayouts] = useState<Partial<Record<number, StampLayout>>>({})
  const [drag, setDrag] = useState<DragState | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [layoutsReady, setLayoutsReady] = useState(false)

  const [stampZIndex, setStampZIndex] = useState<Partial<Record<number, number>>>({})
  const dragRef = useRef<DragState | null>(null)
  const zIndexCounterRef = useRef(1)
  const poolMeasureRef = useRef<HTMLDivElement | null>(null)
  const hasInitializedLayouts = useRef(false)
  const prevCellStampsRef = useRef(cellStamps)
  const [bingoWinCount, setBingoWinCount] = useState(0)

  const bringStampToFront = useCallback((stampIndex: number) => {
    zIndexCounterRef.current += 1
    setStampZIndex((prev) => ({ ...prev, [stampIndex]: zIndexCounterRef.current }))
  }, [])

  useEffect(() => {
    const prevLineIds = new Set(
      getCompletedBingoLines(prevCellStampsRef.current.map((cell) => cell !== null)).map(
        (line) => line.id,
      ),
    )
    const hasNewLine = getCompletedBingoLines(cellStamps.map((cell) => cell !== null)).some(
      (line) => !prevLineIds.has(line.id),
    )

    if (hasNewLine) setBingoWinCount((count) => count + 1)
    prevCellStampsRef.current = cellStamps
  }, [cellStamps])

  const syncCellStampLayouts = useCallback(() => {
    const playfield = playfieldRef.current
    if (!playfield) return

    setStampLayouts((prev) => {
      const next = { ...prev }
      cellStamps.forEach((stampIndex, cellIndex) => {
        if (stampIndex === null) return
        const existing = prev[stampIndex]
        if (!existing) return
        const layout = getSnappedCellLayout(cellIndex, playfield, existing)
        if (layout) next[stampIndex] = layout
      })
      return next
    })
  }, [cellStamps, playfieldRef])

  useLayoutEffect(() => {
    const playfield = playfieldRef.current
    const pool = poolMeasureRef.current
    if (!playfield || !pool || hasInitializedLayouts.current) return

    const initial = getRandomPoolLayouts(pool, playfield, STAMP_COUNT)

    if (initial && Object.keys(initial).length === STAMP_COUNT) {
      hasInitializedLayouts.current = true
      setStampLayouts(initial)
      setLayoutsReady(true)
    }
  }, [playfieldRef])

  useLayoutEffect(() => {
    if (!layoutsReady) return
    syncCellStampLayouts()
  }, [layoutsReady, syncCellStampLayouts])

  useLayoutEffect(() => {
    const playfield = playfieldRef.current
    if (!playfield || !layoutsReady) return

    const observer = new ResizeObserver(() => syncCellStampLayouts())
    observer.observe(playfield)
    return () => observer.disconnect()
  }, [layoutsReady, playfieldRef, syncCellStampLayouts])

  const clampDragPosition = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const section = sectionRef.current
      const playfield = playfieldRef.current
      if (!section || !playfield) return { x, y }

      const sectionRect = section.getBoundingClientRect()
      const playfieldRect = playfield.getBoundingClientRect()

      const clientX = playfieldRect.left + x
      const clientY = playfieldRect.top + y
      const clampedClientX = clamp(clientX, sectionRect.left, sectionRect.right - width)
      const clampedClientY = clamp(clientY, sectionRect.top, sectionRect.bottom - height)

      return {
        x: clampedClientX - playfieldRect.left,
        y: clampedClientY - playfieldRect.top,
      }
    },
    [sectionRef, playfieldRef],
  )

  const clearDrag = useCallback(() => {
    dragRef.current = null
    setIsDragging(false)
    setDrag(null)
  }, [])

  const finishDrag = useCallback(
    (state: DragState) => {
      const playfield = playfieldRef.current
      if (!playfield) return

      const pf = playfield.getBoundingClientRect()
      const centerClientX = pf.left + state.x + state.width / 2
      const centerClientY = pf.top + state.y + state.height / 2
      const targetCell = getCellIndexFromPoint(centerClientX, centerClientY, playfield)

      const freeLayout: StampLayout = {
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
      }

      setCellStamps((prev) => {
        const next = [...prev]
        const stampIndex = state.stampIndex

        setStampLayouts((layouts) => {
          const layoutNext = { ...layouts, [stampIndex]: freeLayout }

          if (targetCell !== null) {
            const stampSize = { width: state.width, height: state.height }
            const cellLayout = getSnappedCellLayout(targetCell, playfield, stampSize)
            if (!cellLayout) return layouts

            const occupiedBy = prev[targetCell]
            layoutNext[stampIndex] = cellLayout

            if (occupiedBy !== null && occupiedBy !== stampIndex) {
              const displacedSize = layouts[occupiedBy] ?? stampSize
              if (state.fromCell !== null) {
                const fromLayout = getSnappedCellLayout(state.fromCell, playfield, displacedSize)
                if (fromLayout) layoutNext[occupiedBy] = fromLayout
              } else {
                layoutNext[occupiedBy] = freeLayout
              }
            }

            return layoutNext
          }

          return layoutNext
        })

        if (targetCell !== null) {
          const cellLayout = getSnappedCellLayout(targetCell, playfield, {
            width: state.width,
            height: state.height,
          })
          if (!cellLayout) return prev

          const occupiedBy = prev[targetCell]

          if (occupiedBy !== null && occupiedBy !== stampIndex) {
            const displacedCell = next.indexOf(occupiedBy)
            if (displacedCell >= 0) next[displacedCell] = null
          }

          if (state.fromCell !== null) next[state.fromCell] = null

          if (occupiedBy !== null && occupiedBy !== stampIndex && state.fromCell !== null) {
            next[state.fromCell] = occupiedBy
          }

          next[targetCell] = stampIndex
          return next
        }

        if (state.fromCell !== null) next[state.fromCell] = null
        return next
      })
    },
    [playfieldRef],
  )

  useLayoutEffect(() => {
    if (!isDragging) return

    const onWindowPointerMove = (event: PointerEvent) => {
      onPointerMove?.(event.clientX, event.clientY)

      const current = dragRef.current
      const playfield = playfieldRef.current
      if (!current || !playfield) return

      const { x: localX, y: localY } = clientToPlayfield(event.clientX, event.clientY, playfield)
      const { x, y } = clampDragPosition(
        localX - current.offsetX,
        localY - current.offsetY,
        current.width,
        current.height,
      )
      const next = { ...current, x, y }
      dragRef.current = next
      setDrag(next)
    }

    const onWindowPointerUp = (event: PointerEvent) => {
      onPointerMove?.(event.clientX, event.clientY)

      const current = dragRef.current
      if (current) finishDrag(current)
      clearDrag()
    }

    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp)
    window.addEventListener('pointercancel', onWindowPointerUp)

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove)
      window.removeEventListener('pointerup', onWindowPointerUp)
      window.removeEventListener('pointercancel', onWindowPointerUp)
    }
  }, [isDragging, clampDragPosition, clearDrag, finishDrag, onPointerMove, playfieldRef])

  const onStampPointerDown = useCallback(
    (stampIndex: number, fromCell: number | null) => (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0 || dragRef.current) return
      event.preventDefault()

      const playfield = playfieldRef.current
      const target = event.currentTarget
      if (!playfield) return

      bringStampToFront(stampIndex)
      onPointerMove?.(event.clientX, event.clientY)

      const rect = target.getBoundingClientRect()
      const pf = playfield.getBoundingClientRect()
      const next: DragState = {
        stampIndex,
        fromCell,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        width: rect.width,
        height: rect.height,
        x: rect.left - pf.left,
        y: rect.top - pf.top,
      }

      if (fromCell !== null) {
        setCellStamps((prev) => {
          if (prev[fromCell] !== stampIndex) return prev
          const cells = [...prev]
          cells[fromCell] = null
          return cells
        })
      }

      dragRef.current = next

      flushSync(() => {
        setIsDragging(true)
        setDrag(next)
      })
    },
    [playfieldRef, bringStampToFront, onPointerMove],
  )

  const getStampZIndex = useCallback(
    (stampIndex: number) => stampZIndex[stampIndex] ?? 1,
    [stampZIndex],
  )

  const getStampLayout = useCallback(
    (stampIndex: number): StampLayout | null => {
      if (drag?.stampIndex === stampIndex) {
        return {
          x: drag.x,
          y: drag.y,
          width: drag.width,
          height: drag.height,
        }
      }
      return stampLayouts[stampIndex] ?? null
    },
    [drag, stampLayouts],
  )

  return {
    cellStamps,
    drag,
    bingoWinCount,
    isDragging,
    layoutsReady,
    poolMeasureRef,
    getStampLayout,
    getStampZIndex,
    onStampPointerDown,
  }
}
