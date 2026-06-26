import { createPortal } from 'react-dom'

type TextCursorProps = {
  x: number
  y: number
  label: string
}

export function TextCursor({ x, y, label }: TextCursorProps) {
  return createPortal(
    <div
      aria-hidden
      className="text-cursor"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {label}
    </div>,
    document.body,
  )
}
