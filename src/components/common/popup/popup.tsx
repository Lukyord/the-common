'use client'

import React, { useEffect, useRef, ReactNode } from 'react'

type PopupProps = {
  children: ReactNode
  className?: string
  position?: 'start' | 'center' | 'end'
  onOpen?: () => void
  onClose?: () => void
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
  closeOtherPopups?: boolean
}

export default function Popup({
  children,
  className = '',
  position = 'start',
  onOpen,
  onClose,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  closeOtherPopups = true,
}: PopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const popup = popupRef.current
    if (!popup) return

    const trigger = popup.querySelector('.popup-trigger') as HTMLElement
    const content = popup.querySelector('.popup-content') as HTMLElement

    if (!trigger || !content) return

    // Handle trigger click
    const handleTriggerClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Close other active popups
      if (closeOtherPopups) {
        document.querySelectorAll('.popup.active').forEach((activePopup) => {
          if (activePopup !== popup) {
            activePopup.classList.remove('active')
          }
        })
      }

      // Toggle current popup
      const isActive = popup.classList.contains('active')
      if (isActive) {
        popup.classList.remove('active')
        onClose?.()
      } else {
        popup.classList.add('active')
        onOpen?.()
      }
    }

    // Close popup when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (!closeOnOutsideClick) return

      if (!popup.contains(e.target as Node)) {
        const isActive = popup.classList.contains('active')
        if (isActive) {
          popup.classList.remove('active')
          onClose?.()
        }
      }
    }

    // Close popup on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (!closeOnEscape) return

      if (e.key === 'Escape' && popup.classList.contains('active')) {
        popup.classList.remove('active')
        onClose?.()
      }
    }

    trigger.addEventListener('click', handleTriggerClick)
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      trigger.removeEventListener('click', handleTriggerClick)
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [closeOnOutsideClick, closeOnEscape, closeOtherPopups, onOpen, onClose])

  return (
    <div ref={popupRef} className={`popup ${className}`} data-popup-pc-location={position}>
      {children}
    </div>
  )
}
