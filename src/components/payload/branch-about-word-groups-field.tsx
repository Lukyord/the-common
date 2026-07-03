'use client'

import './branch-about-word-groups-field.scss'

import type { ArrayFieldClientComponent, ClientField, FormState } from 'payload'
import { useEffect, useMemo, useRef } from 'react'
import {
  Banner,
  FieldDescription,
  FieldError,
  FieldLabel,
  RenderFields,
  useField,
  useForm,
  useFormFields,
  useFormInitializing,
} from '@payloadcms/ui'

import {
  BRANCH_ABOUT_WORDS_BY_SLUG,
  getBranchAboutWordLabel,
  type BranchAboutWord,
} from '@/constants/branchAboutWords'

type WordGroupRow = {
  word?: BranchAboutWord | null
  title?: string | null
  description?: string | null
  media?: number | null
  id?: string | null
}

type SubFieldState = Record<
  string,
  {
    initialValue?: unknown
    valid: boolean
    value: unknown
  }
>

function buildSubFieldState(row: WordGroupRow | undefined, word: BranchAboutWord): SubFieldState {
  const state: SubFieldState = {
    word: {
      value: word,
      initialValue: word,
      valid: true,
    },
  }

  if (row?.title != null) {
    state.title = { value: row.title, initialValue: row.title, valid: true }
  }

  if (row?.description != null) {
    state.description = {
      value: row.description,
      initialValue: row.description,
      valid: true,
    }
  }

  if (row?.media != null) {
    state.media = { value: row.media, initialValue: row.media, valid: true }
  }

  return state
}

function rowsMatchExpected(rows: WordGroupRow[] | undefined, expected: readonly BranchAboutWord[]) {
  if (!rows || rows.length !== expected.length) return false

  return expected.every((word, index) => rows[index]?.word === word)
}

export const BranchAboutWordGroupsField: ArrayFieldClientComponent = ({
  field,
  path,
  permissions,
  readOnly,
  schemaPath,
}) => {
  const initializing = useFormInitializing()
  const { addFieldRow, getDataByPath, removeFieldRow } = useForm()
  const { rows, showError } = useField({ path, hasRows: true })
  const lastSyncedKey = useRef<string | null>(null)

  const slug = useFormFields(([fields]) => {
    const value = fields.slug?.value
    return typeof value === 'string' ? value : null
  })

  const expectedWords = slug ? BRANCH_ABOUT_WORDS_BY_SLUG[slug] : undefined

  const resolvedSchemaPath = schemaPath ?? field.name

  const contentFields = useMemo(
    () =>
      field.fields.filter(
        (child): child is ClientField & { name: string } =>
          'name' in child && child.name !== 'word',
      ),
    [field.fields],
  )

  const wordPreview = useMemo(() => {
    if (!expectedWords) return null
    return expectedWords.map(getBranchAboutWordLabel).join(' · ')
  }, [expectedWords])

  useEffect(() => {
    if (initializing || !expectedWords || !slug) return

    const syncKey = `${slug}:${expectedWords.join(',')}`
    const currentRows = getDataByPath(path) as WordGroupRow[] | undefined

    if (rowsMatchExpected(currentRows, expectedWords) && lastSyncedKey.current === syncKey) {
      return
    }

    if (rowsMatchExpected(currentRows, expectedWords)) {
      lastSyncedKey.current = syncKey
      return
    }

    const existingByWord = new Map(
      (currentRows ?? []).filter((row) => row.word).map((row) => [row.word, row]),
    )

    for (let index = (currentRows?.length ?? 0) - 1; index >= 0; index--) {
      removeFieldRow({ path, rowIndex: index })
    }

    expectedWords.forEach((word, index) => {
      addFieldRow({
        path,
        rowIndex: index,
        schemaPath: resolvedSchemaPath,
        subFieldState: buildSubFieldState(existingByWord.get(word), word) as FormState,
      })
    })

    lastSyncedKey.current = syncKey
  }, [
    addFieldRow,
    expectedWords,
    getDataByPath,
    initializing,
    path,
    removeFieldRow,
    resolvedSchemaPath,
    slug,
  ])

  return (
    <div className="field-type array branch-about-word-groups-field">
      <FieldLabel label={field.label} path={path} required={field.required} />
      {field.admin?.description ? (
        <FieldDescription description={field.admin.description} path={path} />
      ) : null}

      {!slug ? (
        <Banner type="info">
          Save a branch slug (Thonglor, Saladaeng, or Cloud11) to show its word groups.
        </Banner>
      ) : null}

      {slug && !expectedWords ? (
        <Banner type="error">No word groups are configured for slug &quot;{slug}&quot;.</Banner>
      ) : null}

      {wordPreview ? (
        <Banner type="info">
          This branch uses {expectedWords?.length} words in order: {wordPreview}
        </Banner>
      ) : null}

      {expectedWords && (rows?.length ?? 0) > 0
        ? expectedWords.map((word, index) => {
            const rowPath = `${path}.${index}`
            const row = rows?.[index]

            if (!row) return null

            return (
              <section key={row.id} className="branch-about-word-groups-field__group">
                <h4 className="branch-about-word-groups-field__word">
                  {getBranchAboutWordLabel(word)}
                </h4>
                <RenderFields
                  fields={contentFields}
                  margins="small"
                  parentIndexPath=""
                  parentPath={rowPath}
                  parentSchemaPath={`${resolvedSchemaPath}.${index}`}
                  permissions={permissions}
                  readOnly={readOnly}
                />
              </section>
            )
          })
        : null}

      <FieldError path={path} showError={showError} />
    </div>
  )
}
