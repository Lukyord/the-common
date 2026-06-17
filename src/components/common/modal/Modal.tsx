'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import './modal.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  contentClassName?: string
  labelledBy?: string
  describedBy?: string
}

export default function Modal({
  open,
  onClose,
  children,
  className = '',
  contentClassName = '',
  labelledBy,
  describedBy,
}: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div
      className={`modal ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      data-lenis-prevent
      onClick={onClose}
    >
      <div
        className={`modal__content ${contentClassName}`.trim()}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
