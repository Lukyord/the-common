'use client'

import { useCallback, useMemo, useState } from 'react'

export function useStickyNoteStack(noteCount: number) {
  const [zByIndex, setZByIndex] = useState<Record<number, number>>({})

  const getZIndex = useCallback((index: number) => zByIndex[index] ?? index + 1, [zByIndex])

  const frontIndex = useMemo(() => {
    if (noteCount === 0) return 0

    return Array.from({ length: noteCount }, (_, index) => index).reduce(
      (front, index) => (getZIndex(index) > getZIndex(front) ? index : front),
      0,
    )
  }, [noteCount, getZIndex])

  const bringToFront = useCallback((index: number) => {
    setZByIndex((prev) => {
      const maxZ = Math.max(index + 1, 3, ...Object.values(prev))
      return { ...prev, [index]: maxZ + 1 }
    })
  }, [])

  return { getZIndex, frontIndex, bringToFront }
}
