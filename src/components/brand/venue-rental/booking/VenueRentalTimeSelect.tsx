'use client'

import { useEffect, useId, useRef, useState } from 'react'

type VenueRentalTimeSelectProps = {
  id: string
  name: string
  label: string
  options: string[]
  defaultValue?: string
  required?: boolean
}

export default function VenueRentalTimeSelect({
  id,
  name,
  label,
  options,
  defaultValue = '',
  required = false,
}: VenueRentalTimeSelectProps) {
  const listboxId = useId()
  const labelId = `${id}-label`
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const emptyValue = defaultValue ?? ''
  const [value, setValue] = useState(emptyValue)
  const [isOpen, setIsOpen] = useState(false)
  const selectableOptions = value ? options.filter((option) => option !== value) : options

  const syncFilled = (nextValue: string, open: boolean) => {
    const inputWrap = rootRef.current
    if (!inputWrap) return
    inputWrap.classList.toggle('filled', nextValue.length > 0 || open)
  }

  useEffect(() => {
    setValue((current) => {
      if (current && options.includes(current)) return current
      return emptyValue
    })
  }, [emptyValue, options])

  useEffect(() => {
    syncFilled(value, isOpen)
  }, [value, isOpen])

  useEffect(() => {
    const form = inputRef.current?.form
    if (!form) return

    const handleReset = () => {
      setValue(emptyValue)
      setIsOpen(false)
      syncFilled(emptyValue, false)
    }

    form.addEventListener('reset', handleReset)
    return () => form.removeEventListener('reset', handleReset)
  }, [emptyValue])

  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen])

  const selectOption = (optionValue: string) => {
    setValue(optionValue)
    setIsOpen(false)

    const input = inputRef.current
    if (!input) return

    input.value = optionValue
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  if (!options.length) return null

  return (
    <div
      ref={rootRef}
      className={['input', 'venue-time-select', isOpen && 'is-open'].filter(Boolean).join(' ')}
    >
      <label id={labelId} className="label anim fixed" htmlFor={id}>
        <span>{label}</span>
      </label>

      <div className="venue-time-select__control">
        <input
          ref={inputRef}
          type="hidden"
          id={id}
          name={name}
          value={value}
          required={required}
          tabIndex={-1}
          aria-hidden
        />

        <button
          type="button"
          role="combobox"
          className="venue-time-select__trigger"
          aria-labelledby={labelId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="venue-time-select__value">{value}</span>
          <span className="venue-time-select__icon" aria-hidden>
            <i className="ic ic-clock" />
          </span>
        </button>

        <div className="venue-time-select__panel" data-open={isOpen}>
          <div className="venue-time-select__panel-inner">
            <ul id={listboxId} role="listbox" aria-label={label}>
              {selectableOptions.map((option) => (
                <li key={option} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === option}
                    className="venue-time-select__option"
                    onClick={() => selectOption(option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
