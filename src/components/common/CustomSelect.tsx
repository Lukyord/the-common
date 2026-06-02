'use client'

import { useEffect, useId, useRef, useState } from 'react'

export type CustomSelectOption = {
  value: string
  label: string
}

export type CustomSelectProps = {
  id: string
  name: string
  label: string
  options: string[] | CustomSelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  required?: boolean
  error?: string
  className?: string
  placeholder?: string
}

function normalizeOptions(options: string[] | CustomSelectOption[]): CustomSelectOption[] {
  return options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  )
}

export default function CustomSelect({
  id,
  name,
  label,
  options,
  value: controlledValue,
  defaultValue = '',
  onChange,
  required = false,
  error,
  className = '',
  placeholder = '',
}: CustomSelectProps) {
  const listboxId = useId()
  const labelId = `${id}-label`
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const normalizedOptions = normalizeOptions(options)
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue
  const selectedLabel =
    normalizedOptions.find((option) => option.value === value)?.label ?? ''

  const syncFilled = (nextValue: string, open: boolean) => {
    const inputWrap = rootRef.current
    if (!inputWrap) return
    inputWrap.classList.toggle('filled', nextValue.length > 0 || open)
  }

  useEffect(() => {
    syncFilled(value, isOpen)
  }, [value, isOpen])

  useEffect(() => {
    const form = inputRef.current?.form
    if (!form || isControlled) return

    const handleReset = () => {
      setUncontrolledValue(defaultValue)
      setIsOpen(false)
      syncFilled(defaultValue, false)
    }

    form.addEventListener('reset', handleReset)
    return () => form.removeEventListener('reset', handleReset)
  }, [defaultValue, isControlled])

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

  const setValue = (nextValue: string) => {
    if (!isControlled) setUncontrolledValue(nextValue)
    onChange?.(nextValue)

    const input = inputRef.current
    if (!input) return

    input.value = nextValue
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  const selectOption = (optionValue: string) => {
    setValue(optionValue)
    setIsOpen(false)
  }

  if (!normalizedOptions.length) return null

  const rootClassName = ['input', 'custom-select', isOpen && 'is-open', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={rootRef} className={rootClassName} data-has-error={error ? '' : undefined}>
      <label id={labelId} className="label anim fixed" htmlFor={id}>
        <span>{label}</span>
      </label>

      <div className="custom-select__control">
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
          className="custom-select__trigger"
          aria-labelledby={labelId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="custom-select__value">
            {selectedLabel || placeholder}
          </span>
          <span className="custom-select__icon" aria-hidden>
            <i className="ic ic-chevron-down size-icon-3xs" />
          </span>
        </button>

        <div className="custom-select__panel" data-open={isOpen}>
          <div className="custom-select__panel-inner">
            <ul id={listboxId} role="listbox" aria-label={label}>
              {normalizedOptions.map((option) => (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === option.value}
                    className="custom-select__option"
                    onClick={() => selectOption(option.value)}
                  >
                    {option.label}
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
