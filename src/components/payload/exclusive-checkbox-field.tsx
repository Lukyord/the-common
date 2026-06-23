'use client'

import type { CheckboxFieldClientComponent } from 'payload'
import { CheckboxField, useForm } from '@payloadcms/ui'

function getSiblingPath(path: string, siblingFieldName: string): string {
  const lastDot = path.lastIndexOf('.')
  if (lastDot === -1) return siblingFieldName
  return `${path.slice(0, lastDot + 1)}${siblingFieldName}`
}

export const ExclusiveCheckboxField: CheckboxFieldClientComponent = ({
  field,
  path,
  readOnly,
}) => {
  const { dispatchFields } = useForm()
  const exclusiveWith =
    typeof field.admin?.custom?.exclusiveWith === 'string'
      ? field.admin.custom.exclusiveWith
      : undefined

  return (
    <CheckboxField
      field={field}
      path={path}
      readOnly={readOnly}
      onChange={(checked) => {
        if (!checked || !exclusiveWith) return

        dispatchFields({
          type: 'UPDATE',
          path: getSiblingPath(path, exclusiveWith),
          value: false,
        })
      }}
    />
  )
}
