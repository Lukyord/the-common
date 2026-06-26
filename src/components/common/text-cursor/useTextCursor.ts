import { useCallback, useState, type MouseEvent } from 'react'

export function useTextCursor() {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    setPosition({ x: clientX, y: clientY })
  }, [])

  return {
    isActive,
    position,
    updatePosition,
    getSectionProps: (hideCursor: boolean) => ({
      onMouseEnter: () => setIsActive(true),
      onMouseLeave: () => setIsActive(false),
      onMouseMove: (event: MouseEvent) => {
        updatePosition(event.clientX, event.clientY)
      },
      style: isActive && !hideCursor ? ({ cursor: 'none' } as const) : undefined,
    }),
  }
}
