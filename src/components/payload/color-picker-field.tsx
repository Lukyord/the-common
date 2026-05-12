'use client'

import type { ChangeEvent, KeyboardEventHandler, RefObject } from 'react'
import type { TextFieldClient } from 'payload'
import { TextInput, useField } from '@payloadcms/ui'

type ColorPickerFieldProps = {
  field: Omit<TextFieldClient, 'type'> & Partial<Pick<TextFieldClient, 'type'>>
  inputRef?: RefObject<HTMLInputElement>
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  path: string
  readOnly?: boolean
}

const DEFAULT_COLOR = '#000000'
const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i

export function ColorPickerField({
  field,
  inputRef,
  onKeyDown,
  path,
  readOnly,
}: ColorPickerFieldProps) {
  const { setValue, showError, value } = useField<string>({ path })
  const isReadOnly = Boolean(readOnly || field.admin?.readOnly || field.admin?.disabled)
  const textValue = typeof value === 'string' ? value : ''
  const colorValue = HEX_COLOR_REGEX.test(textValue) ? textValue : DEFAULT_COLOR

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.toUpperCase())
  }

  const label = typeof field.label === 'string' ? field.label : field.name

  return (
    <TextInput
      BeforeInput={
        <input
          aria-label={`${label} color picker`}
          disabled={isReadOnly}
          onChange={handleColorChange}
          style={{
            cursor: isReadOnly ? 'not-allowed' : 'pointer',
            height: 40,
            marginBottom: 8,
            padding: 4,
            width: 64,
          }}
          type="color"
          value={colorValue}
        />
      }
      className={['color-picker-field', field.admin?.className].filter(Boolean).join(' ')}
      description={field.admin?.description}
      inputRef={inputRef}
      label={field.label}
      localized={field.localized}
      onChange={handleTextChange}
      onKeyDown={onKeyDown}
      path={path}
      placeholder={field.admin?.placeholder}
      readOnly={isReadOnly}
      required={field.required}
      rtl={field.admin?.rtl}
      showError={showError}
      style={field.admin?.style}
      value={textValue}
    />
  )
}
