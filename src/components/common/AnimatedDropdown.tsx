'use client'

import { useEffect, useId, useRef, useState } from 'react'

export type AnimatedDropdownOption = {
  value: string
  label: string
}

export type AnimatedDropdownProps = {
  options: AnimatedDropdownOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  ariaLabel?: string
  triggerClassName?: string
}

type PanelPhase = 'closed' | 'entering' | 'open' | 'exiting'

export default function AnimatedDropdown({
  options,
  value,
  onChange,
  className = '',
  ariaLabel = 'Select option',
  triggerClassName = '',
}: AnimatedDropdownProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [panelPhase, setPanelPhase] = useState<PanelPhase>('closed')

  const selectedLabel = options.find((option) => option.value === value)?.label ?? ''
  const isPanelActive = panelPhase === 'entering' || panelPhase === 'open' || panelPhase === 'exiting'

  useEffect(() => {
    if (isOpen) {
      setPanelPhase('entering')
      return
    }

    setPanelPhase((phase) => (phase === 'closed' ? 'closed' : 'exiting'))
  }, [isOpen])

  useEffect(() => {
    if (panelPhase !== 'entering') return

    const frame = requestAnimationFrame(() => {
      setPanelPhase('open')
    })

    return () => cancelAnimationFrame(frame)
  }, [panelPhase])

  useEffect(() => {
    if (!isPanelActive) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isPanelActive])

  const handlePanelTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== 'opacity' && event.propertyName !== 'transform') return

    if (panelPhase === 'exiting') {
      setPanelPhase('closed')
    }
  }

  const selectOption = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  if (!options.length) return null

  const rootClassName = ['animated-dropdown', isOpen && 'is-open', className]
    .filter(Boolean)
    .join(' ')

  const panelClassName = [
    'animated-dropdown__panel',
    panelPhase === 'entering' && 'is-entering',
    panelPhase === 'open' && 'is-open',
    panelPhase === 'exiting' && 'is-exiting',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={rootRef} className={rootClassName}>
      <button
        type="button"
        role="combobox"
        className={['animated-dropdown__trigger', triggerClassName].filter(Boolean).join(' ')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="animated-dropdown__value">{selectedLabel}</span>
        <span className="animated-dropdown__icon" aria-hidden>
          <i className="ic ic-chevron-down size-icon-sm" />
        </span>
      </button>

      {isPanelActive && (
        <div className={panelClassName} onTransitionEnd={handlePanelTransitionEnd}>
          <ul id={listboxId} role="listbox" aria-label={ariaLabel}>
            {options.map((option) => (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  className="animated-dropdown__option type-d-body-m letter-spacing-002 capitalize type-m-body-r"
                  onClick={() => selectOption(option.value)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
