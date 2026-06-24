'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import './modal.css'

const MODAL_TRANSITION_MS = 300

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
  const [portalReady, setPortalReady] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setPortalReady(true)
  }, [])

  useEffect(() => {
    if (!portalReady) return

    if (open) {
      setShouldRender(true)
      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setIsActive(true))
      })

      return () => window.cancelAnimationFrame(frame)
    }

    setIsActive(false)
    const timer = window.setTimeout(() => setShouldRender(false), MODAL_TRANSITION_MS)

    return () => window.clearTimeout(timer)
  }, [open, portalReady])

  useEffect(() => {
    if (!isActive) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isActive, onClose])

  if (!portalReady || !shouldRender) return null

  return createPortal(
    <div
      className={`modal ${isActive ? 'is-active' : ''} ${className}`.trim()}
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
        data-lenis-prevent
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
