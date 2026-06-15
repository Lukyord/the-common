'use client'

import type { ChangeEvent, MouseEvent } from 'react'
import { useState } from 'react'
import type { TextFieldClient } from 'payload'
import { TextInput, useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'

import { getBranchIds, resolveBranchAwareSlug, slugify } from '@/lib/branchAwareSlug'

type GenerateSlugFieldProps = {
  field: Omit<TextFieldClient, 'type'> & Partial<Pick<TextFieldClient, 'type'>>
  path: string
  readOnly?: boolean
}

type SlugFieldCustom = {
  sourceField?: string
  branchField?: string
}

function getFieldCustom(field: GenerateSlugFieldProps['field']): SlugFieldCustom {
  const custom = field.admin?.custom
  if (!custom || typeof custom !== 'object') return {}
  return custom as SlugFieldCustom
}

function getSourceFieldName(field: GenerateSlugFieldProps['field']): string {
  const { sourceField } = getFieldCustom(field)
  if (typeof sourceField === 'string' && sourceField.trim()) return sourceField
  return 'name'
}

function getBranchFieldName(field: GenerateSlugFieldProps['field']): string | null {
  const { branchField } = getFieldCustom(field)
  if (branchField === '') return null
  if (typeof branchField === 'string' && branchField.trim()) return branchField
  return 'branch'
}

export function GenerateSlugField({ field, path, readOnly }: GenerateSlugFieldProps) {
  const { collectionSlug: documentCollectionSlug, docConfig, id: currentDocumentId } =
    useDocumentInfo()
  const collectionSlug =
    documentCollectionSlug ??
    (docConfig && 'slug' in docConfig && typeof docConfig.slug === 'string'
      ? docConfig.slug
      : undefined)
  const { setValue, showError, value } = useField<string>({ path })
  const [isGenerating, setIsGenerating] = useState(false)
  const isReadOnly = Boolean(readOnly || field.admin?.readOnly || field.admin?.disabled)

  const sourceFieldName = getSourceFieldName(field)
  const branchFieldName = getBranchFieldName(field)

  const sourceText = useFormFields(([fields]) => fields?.[sourceFieldName]?.value)
  const branchValue = useFormFields(([fields]) =>
    branchFieldName ? fields?.[branchFieldName]?.value : undefined,
  )

  const textValue = typeof value === 'string' ? value : ''
  const sourceLabel = typeof sourceText === 'string' ? sourceText : ''
  const branchIds = branchFieldName ? getBranchIds(branchValue) : []
  const canGenerate = Boolean(sourceLabel) && !isGenerating

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleGenerate = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (isReadOnly || !sourceLabel) return

    setIsGenerating(true)

    try {
      const next =
        collectionSlug && branchFieldName && branchIds.length > 0
          ? await resolveBranchAwareSlug({
              sourceText: sourceLabel,
              collectionSlug,
              currentDocumentId,
              branchValue,
            })
          : slugify(sourceLabel)

      if (next) setValue(next)
    } finally {
      setIsGenerating(false)
    }
  }

  const label = typeof field.label === 'string' ? field.label : field.name

  return (
    <TextInput
      AfterInput={
        <button
          className="btn btn--style-secondary btn--size-small"
          disabled={isReadOnly || !canGenerate}
          onClick={(event) => {
            void handleGenerate(event)
          }}
          style={{ marginBottom: 8, whiteSpace: 'nowrap' }}
          type="button"
        >
          {isGenerating ? 'Generating…' : 'Generate'}
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
