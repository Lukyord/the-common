import { LEGACY_BRANCH_TO_SLUG } from '../config/branch-map.js'
import { getEventFingerprint } from './eventFingerprint.js'
import { getEventImagePaths } from './legacyImages.js'
import { mapLegacyTags } from './mapLegacyTags.js'
import { parseLegacyWhen } from './parseLegacyWhen.js'
import type { LegacyEvent, MappedLegacyEvent } from './types.js'
import { getLegacyId, getMigrationCutoffDate, oidToDate, toIsoDate } from '../../lib/legacy.js'
import {
  createLegacySlugRegistry,
  resolveLegacyEventSlug,
  type LegacySlugRegistry,
} from '../../lib/slugRegistry.js'

function buildContentHtml(event: LegacyEvent): string | null {
  const parts: string[] = []

  if (event.shortDescription?.trim()) {
    parts.push(`<p>${event.shortDescription.trim()}</p>`)
  }

  if (event.detail?.trim()) {
    parts.push(event.detail.trim())
  }

  if (event.phone?.trim()) {
    const normalizedPhone = event.phone.replace(/[\s-]/g, '')
    const detailHasPhone =
      event.detail?.includes(event.phone) ||
      event.detail?.replace(/[\s-]/g, '').includes(normalizedPhone)

    if (!detailHasPhone) {
      parts.push(`<p>Phone: ${event.phone.trim()}</p>`)
    }
  }

  if (!parts.length) return null
  return parts.join('\n')
}

export function mapLegacyEvent(
  event: LegacyEvent,
  slugRegistry: LegacySlugRegistry,
  cutoff = getMigrationCutoffDate(),
): MappedLegacyEvent {
  const legacyId = getLegacyId(event)
  const warnings: string[] = []
  const branchSlug = event.branch ? LEGACY_BRANCH_TO_SLUG[event.branch] : undefined

  if (!branchSlug) {
    return buildSkipped(event, legacyId, `Unknown branch: ${event.branch ?? 'missing'}`, warnings)
  }

  const parsedWhen = parseLegacyWhen(event.when, {
    fallbackYear: oidToDate(legacyId).getFullYear(),
    archiveDate: event.updatedPastAt?.$date ? new Date(event.updatedPastAt.$date) : null,
  })

  warnings.push(...parsedWhen.warnings)

  if (!parsedWhen.endDate) {
    return buildSkipped(
      event,
      legacyId,
      event.when?.trim() ? `Could not parse date: ${event.when}` : 'Missing when date',
      warnings,
    )
  }

  if (parsedWhen.endDate < cutoff) {
    return buildSkipped(
      event,
      legacyId,
      `Event end date ${toIsoDate(parsedWhen.endDate)} is before cutoff ${toIsoDate(cutoff)}`,
      warnings,
    )
  }

  const tags = mapLegacyTags(event)
  if (tags.unmappedTags.length) {
    warnings.push(`Unmapped tags: ${tags.unmappedTags.join(', ')}`)
  }
  if (tags.droppedSubTags.length) {
    warnings.push(`Dropped sub tags (>3): ${tags.droppedSubTags.join(', ')}`)
  }

  const { mediaPath, galleryPaths, galleryReuseMedia } = getEventImagePaths(event)
  const fingerprint = getEventFingerprint({ contentHtml: buildContentHtml(event), mediaPath, galleryPaths })
  const slug = resolveLegacyEventSlug(event.slug, branchSlug, legacyId, fingerprint, slugRegistry)

  if (slug !== event.slug) {
    warnings.push(`Slug deduped: ${event.slug} -> ${slug}`)
  } else {
    const group = slugRegistry.groups.find(
      (entry) => entry.slug === slug && entry.fingerprint === fingerprint,
    )
    if (group && group.branches.size > 1) {
      warnings.push(`Shared slug across branches: ${[...group.branches].join(', ')}`)
    }
  }

  return {
    legacyId,
    legacySlug: event.slug,
    title: event.name,
    slug,
    fingerprint,
    branchSlug,
    eventSchedule: parsedWhen.eventSchedule,
    time: parsedWhen.time,
    dateToBeArchived: toIsoDate(parsedWhen.endDate),
    mainTag: tags.mainTag,
    subTags: tags.subTags,
    contentHtml: buildContentHtml(event),
    metaDescription: event.shortDescription?.trim() || null,
    mediaPath,
    galleryPaths,
    galleryReuseMedia,
    warnings,
    skippedReason: null,
  }
}

function buildSkipped(
  event: LegacyEvent,
  legacyId: string,
  reason: string,
  warnings: string[] = [],
): MappedLegacyEvent {
  const branchSlug = event.branch
    ? (LEGACY_BRANCH_TO_SLUG[event.branch] ?? event.branch)
    : 'unknown'
  const { mediaPath, galleryPaths, galleryReuseMedia } = getEventImagePaths(event)

  return {
    legacyId,
    legacySlug: event.slug,
    title: event.name,
    slug: event.slug,
    fingerprint: '',
    branchSlug,
    eventSchedule: null,
    time: null,
    dateToBeArchived: null,
    mainTag: null,
    subTags: [],
    contentHtml: null,
    metaDescription: null,
    mediaPath,
    galleryPaths,
    galleryReuseMedia,
    warnings,
    skippedReason: reason,
  }
}

export function mapLegacyEvents(
  events: LegacyEvent[],
  cutoff = getMigrationCutoffDate(),
): MappedLegacyEvent[] {
  const slugRegistry = createLegacySlugRegistry()
  return events.map((event) => mapLegacyEvent(event, slugRegistry, cutoff))
}

export function getEligibleEvents(mapped: MappedLegacyEvent[]): MappedLegacyEvent[] {
  return mapped.filter((event) => !event.skippedReason)
}
