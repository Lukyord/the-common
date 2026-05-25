import { createPortal } from 'react-dom'

type DragCursorProps = {
  x: number
  y: number
}

export function DragCursor({ x, y }: DragCursorProps) {
  return createPortal(
    <div
      aria-hidden
      className="bingo-cursor"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      Drag!
    </div>,
    document.body,
  )
}
