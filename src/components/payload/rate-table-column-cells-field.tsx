'use client'

import './rate-table-column-cells-field.scss'

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

type CellRow = {
  value?: string | null
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

function getRowsPath(cellsPath: string): string {
  return cellsPath.replace(/\.cols\.\d+\.cells$/, '.rows')
}

function normalizeRowLabels(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value.map((item) => (typeof item === 'string' ? item : ''))
}

function buildSubFieldState(row: CellRow | undefined): SubFieldState {
  if (row?.value == null) return {}

  return {
    value: {
      value: row.value,
      initialValue: row.value,
      valid: true,
    },
  }
}

function cellsMatchCount(cells: CellRow[] | undefined, count: number) {
  return (cells?.length ?? 0) === count
}

export const RateTableColumnCellsField: ArrayFieldClientComponent = ({
  field,
  path,
  permissions,
  readOnly,
  schemaPath,
}) => {
  const initializing = useFormInitializing()
  const { addFieldRow, getDataByPath, removeFieldRow } = useForm()
  const { rows, showError } = useField({ path, hasRows: true })
  const lastSyncedCount = useRef<number | null>(null)

  const rowsPath = useMemo(() => getRowsPath(path), [path])
  const rowLabels = useFormFields(() => normalizeRowLabels(getDataByPath(rowsPath)))

  const resolvedSchemaPath = schemaPath ?? field.name

  const valueField = useMemo(
    () =>
      field.fields.find(
        (child): child is ClientField & { name: string } =>
          'name' in child && child.name === 'value',
      ),
    [field.fields],
  )

  useEffect(() => {
    if (initializing) return

    const count = rowLabels.length
    const currentCells = getDataByPath(path) as CellRow[] | undefined

    if (cellsMatchCount(currentCells, count) && lastSyncedCount.current === count) {
      return
    }

    if (cellsMatchCount(currentCells, count)) {
      lastSyncedCount.current = count
      return
    }

    for (let index = (currentCells?.length ?? 0) - 1; index >= 0; index--) {
      removeFieldRow({ path, rowIndex: index })
    }

    rowLabels.forEach((_, index) => {
      addFieldRow({
        path,
        rowIndex: index,
        schemaPath: resolvedSchemaPath,
        subFieldState: buildSubFieldState(currentCells?.[index]) as FormState,
      })
    })

    lastSyncedCount.current = count
  }, [
    addFieldRow,
    getDataByPath,
    initializing,
    path,
    removeFieldRow,
    resolvedSchemaPath,
    rowLabels,
  ])

  return (
    <div className="field-type array rate-table-column-cells-field">
      <FieldLabel label={field.label} path={path} required={field.required} />
      {field.admin?.description ? (
        <FieldDescription description={field.admin.description} path={path} />
      ) : null}

      {rowLabels.length === 0 ? (
        <Banner type="info">Add row labels in Values above to generate cells for this column.</Banner>
      ) : null}

      {rowLabels.length > 0 && valueField
        ? rowLabels.map((label, index) => {
            const rowPath = `${path}.${index}`
            const row = rows?.[index]

            if (!row) return null

            return (
              <section key={row.id} className="rate-table-column-cells-field__row">
                <h4 className="rate-table-column-cells-field__label">
                  {label.trim() || `Row ${index + 1}`}
                </h4>
                <RenderFields
                  fields={[valueField]}
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
