'use client'

import type { OptionObject, TextFieldClient } from 'payload'
import { useEffect, useMemo, useState } from 'react'
import type { Branch } from '@/payload-types'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  SelectInput,
  useField,
  useFormFields,
} from '@payloadcms/ui'

type BranchFloor = NonNullable<Branch['floors']>[number]

function getBranchFormState(branch: unknown): {
  branchFloors: BranchFloor[] | null
  branchId: number | null
} {
  if (typeof branch === 'number') {
    return { branchFloors: null, branchId: branch }
  }

  if (branch && typeof branch === 'object' && 'id' in branch) {
    const populated = branch as Branch
    return {
      branchFloors: Array.isArray(populated.floors) ? populated.floors : null,
      branchId: populated.id,
    }
  }

  return { branchFloors: null, branchId: null }
}

type BranchFloorSelectFieldProps = {
  field: TextFieldClient
  path: string
  readOnly?: boolean
}

function toFloorOptions(floors: BranchFloor[] | null | undefined): OptionObject[] {
  if (!Array.isArray(floors)) return []

  return floors
    .filter((floor): floor is BranchFloor & { floorId: string } => Boolean(floor?.floorId))
    .map((floor) => ({
      label: floor.text || floor.floorId,
      value: floor.floorId,
    }))
}

export function BranchFloorSelectField({ field, path, readOnly }: BranchFloorSelectFieldProps) {
  const { setValue, showError, value } = useField<string>({ path })
  const isReadOnly = Boolean(readOnly || field.admin?.readOnly || field.admin?.disabled)

  const { branchFloors, branchId } = useFormFields(([fields]) =>
    getBranchFormState(fields.branch?.value),
  )

  const [fetchedFloors, setFetchedFloors] = useState<BranchFloor[] | null>(null)

  useEffect(() => {
    if (!branchId) {
      setValue('')
      setFetchedFloors(null)
      return
    }

    if (branchFloors !== null) {
      setFetchedFloors(null)
      return
    }

    let cancelled = false

    void fetch(`/api/branches/${branchId}?depth=0`)
      .then((response) => response.json() as Promise<Pick<Branch, 'floors'>>)
      .then((doc) => {
        if (!cancelled) {
          setFetchedFloors(Array.isArray(doc.floors) ? doc.floors : [])
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchedFloors([])
        }
      })

    return () => {
      cancelled = true
    }
  }, [branchId, branchFloors, setValue])

  const options = useMemo(
    () => toFloorOptions(branchFloors ?? fetchedFloors),
    [branchFloors, fetchedFloors],
  )

  const selectValue = typeof value === 'string' && value ? value : undefined

  return (
    <div className="field-type select branch-floor-select-field">
      <FieldLabel htmlFor={`field-${path}`} label={field.label} required={field.required} />
      <SelectInput
        isClearable={!field.required}
        name={path}
        onChange={(selected) => {
          if (!selected || Array.isArray(selected)) {
            setValue('')
            return
          }
          setValue(selected.value)
        }}
        options={options}
        path={path}
        readOnly={isReadOnly || !branchId}
        required={field.required}
        showError={showError}
        value={selectValue}
      />
      {field.admin?.description ? (
        <FieldDescription description={field.admin.description} path={path} />
      ) : null}
      <FieldError path={path} showError={showError} />
    </div>
  )
}
