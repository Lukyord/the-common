'use client'

import type { ClientField, GroupFieldClientComponent } from 'payload'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Banner,
  FieldDescription,
  FieldError,
  FieldLabel,
  RenderFields,
  useField,
  useFormFields,
} from '@payloadcms/ui'

import {
  WHATS_ON_BRANCH_LOCATION_FIELDS,
  type WhatsOnBranchLocationSlug,
} from '@/constants/whatsOnBranchLocations'
import type { Branch } from '@/payload-types'

function getBranchIds(branch: unknown): number[] {
  if (!Array.isArray(branch)) return []

  return branch
    .map((item) => {
      if (typeof item === 'number') return item
      if (item && typeof item === 'object' && 'id' in item) return (item as Branch).id
      return null
    })
    .filter((id): id is number => typeof id === 'number')
}

function getBranchSlug(item: unknown): WhatsOnBranchLocationSlug | null {
  if (!item || typeof item !== 'object' || !('slug' in item)) return null

  const slug = (item as Branch).slug
  if (typeof slug !== 'string') return null

  return WHATS_ON_BRANCH_LOCATION_FIELDS.some((field) => field.slug === slug)
    ? (slug as WhatsOnBranchLocationSlug)
    : null
}

export const WhatsOnBranchLocationsField: GroupFieldClientComponent = ({
  field,
  path,
  permissions,
  readOnly,
  schemaPath,
}) => {
  const { showError } = useField({ path })
  const resolvedSchemaPath = schemaPath ?? ('name' in field ? field.name : path)

  const branchValue = useFormFields(([fields]) => fields.branch?.value)

  const branchIdsKey = useMemo(() => {
    return getBranchIds(branchValue)
      .sort((a, b) => a - b)
      .join(',')
  }, [branchValue])

  const branchIds = useMemo(
    () => (branchIdsKey ? branchIdsKey.split(',').map(Number) : []),
    [branchIdsKey],
  )

  const slugsFromValue = useMemo(() => {
    if (!Array.isArray(branchValue)) return []

    return branchValue
      .map(getBranchSlug)
      .filter((slug): slug is WhatsOnBranchLocationSlug => Boolean(slug))
  }, [branchValue])

  const slugCacheRef = useRef<Map<string, WhatsOnBranchLocationSlug[]>>(new Map())
  const [fetchedSlugs, setFetchedSlugs] = useState<WhatsOnBranchLocationSlug[]>([])

  useEffect(() => {
    if (!branchIdsKey) {
      setFetchedSlugs([])
      return
    }

    if (slugsFromValue.length === branchIds.length) {
      setFetchedSlugs([])
      return
    }

    const cached = slugCacheRef.current.get(branchIdsKey)
    if (cached) {
      setFetchedSlugs(cached)
      return
    }

    let cancelled = false

    void Promise.all(
      branchIds.map((id) =>
        fetch(`/api/branches/${id}?depth=0`)
          .then((response) => response.json() as Promise<Pick<Branch, 'slug'>>)
          .then((doc): WhatsOnBranchLocationSlug | null => {
            const slug = doc.slug
            return WHATS_ON_BRANCH_LOCATION_FIELDS.some((field) => field.slug === slug)
              ? (slug as WhatsOnBranchLocationSlug)
              : null
          })
          .catch((): null => null),
      ),
    ).then((slugs) => {
      if (cancelled) return

      const resolved = slugs.filter((slug): slug is WhatsOnBranchLocationSlug => Boolean(slug))
      slugCacheRef.current.set(branchIdsKey, resolved)
      setFetchedSlugs(resolved)
    })

    return () => {
      cancelled = true
    }
  }, [branchIds, branchIdsKey, branchIds.length, slugsFromValue.length])

  const selectedSlugs =
    slugsFromValue.length === branchIds.length && branchIds.length > 0
      ? slugsFromValue
      : fetchedSlugs

  const visibleFieldNames = useMemo(() => {
    const names = new Set<string>()

    for (const item of WHATS_ON_BRANCH_LOCATION_FIELDS) {
      if (selectedSlugs.includes(item.slug)) {
        names.add(item.name)
      }
    }

    return names
  }, [selectedSlugs])

  const branchLocationTextNames = useMemo(
    () => new Set<string>(WHATS_ON_BRANCH_LOCATION_FIELDS.map((item) => item.name)),
    [],
  )

  const visibleFields = useMemo(
    () =>
      field.fields.filter((child): child is ClientField & { name: string } => {
        if (!('name' in child) || typeof child.name !== 'string') return false
        if (!branchLocationTextNames.has(child.name)) return true
        return visibleFieldNames.has(child.name)
      }),
    [branchLocationTextNames, field.fields, visibleFieldNames],
  )

  return (
    <div className="field-type group whats-on-branch-locations-field">
      <FieldLabel label={field.label} path={path} />
      {field.admin?.description ? (
        <FieldDescription description={field.admin.description} path={path} />
      ) : null}

      {branchIds.length === 0 ? (
        <Banner type="info">Select a branch above to set its location.</Banner>
      ) : null}

      {visibleFields.length > 0 ? (
        <RenderFields
          fields={visibleFields}
          margins="small"
          parentIndexPath=""
          parentPath={path}
          parentSchemaPath={resolvedSchemaPath}
          permissions={permissions}
          readOnly={readOnly}
        />
      ) : null}

      <FieldError path={path} showError={showError} />
    </div>
  )
}
