'use client'

import type { ChangeEvent, MouseEvent } from 'react'
import type { TextFieldClient } from 'payload'
import { TextInput, useField, useFormFields } from '@payloadcms/ui'

type GenerateSlugFieldProps = {
  field: Omit<TextFieldClient, 'type'> & Partial<Pick<TextFieldClient, 'type'>>
  path: string
  readOnly?: boolean
}

function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getSourceFieldName(field: GenerateSlugFieldProps['field']): string {
  const custom = field.admin?.custom as unknown
  if (custom && typeof custom === 'object' && 'sourceField' in custom) {
    const sourceField = (custom as { sourceField?: unknown }).sourceField
    if (typeof sourceField === 'string' && sourceField.trim()) return sourceField
  }
  return 'name'
}

export function GenerateSlugField({ field, path, readOnly }: GenerateSlugFieldProps) {
  const { setValue, showError, value } = useField<string>({ path })
  const isReadOnly = Boolean(readOnly || field.admin?.readOnly || field.admin?.disabled)

  const sourceFieldName = getSourceFieldName(field)
  const sourceValue = useFormFields(([fields]) => fields?.[sourceFieldName]?.value as unknown)

  const textValue = typeof value === 'string' ? value : ''
  const sourceText = typeof sourceValue === 'string' ? sourceValue : ''

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleGenerate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (isReadOnly) return

    const next = slugify(sourceText)
    if (next) setValue(next)
  }

  const label = typeof field.label === 'string' ? field.label : field.name

  return (
    <TextInput
      AfterInput={
        <button
          className="btn btn--style-secondary btn--size-small"
          disabled={isReadOnly || !sourceText}
          onClick={handleGenerate}
          style={{ marginBottom: 8, whiteSpace: 'nowrap' }}
          type="button"
        >
          Generate
        </button>
      }
      className={field.admin?.className}
      description={field.admin?.description}
      label={label}
      localized={field.localized}
      onChange={handleChange}
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

