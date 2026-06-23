import type { Field } from 'payload'

type ExclusiveCheckboxCondition = NonNullable<NonNullable<Field['admin']>['condition']>

export function exclusiveCheckboxField(
  name: string,
  label: string,
  exclusiveWith: string,
  description: string,
  condition?: ExclusiveCheckboxCondition,
): Field {
  return {
    name,
    type: 'checkbox',
    label,
    defaultValue: false,
    admin: {
      condition,
      description,
      components: {
        Field: '@/components/payload/exclusive-checkbox-field#ExclusiveCheckboxField',
      },
      custom: {
        exclusiveWith,
      },
    },
  }
}
