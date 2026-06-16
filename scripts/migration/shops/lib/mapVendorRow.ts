import { VENDOR_TAGS } from '@/constants/vendorTags'
import { slugify } from '@/lib/branchAwareSlug'

import type { BranchVendorConfig } from '../config/branches.js'
import { normalizeTelList } from './normalizeTel.js'
import { parseSocialLinks } from './parseSocialLinks.js'
import type { VendorCsvRow } from './parseVendorCsv.js'

export type MappedVendor = {
  rowNumber: number
  branchSlug: string
  name: string
  slug: string
  description: string | null
  mood: string | null
  categoryText: string | null
  offerTexts: string[]
  tagIds: string[]
  openingHours: string | null
  tel: string[]
  lotNumber: number | null
  floorId: string | null
  social: ReturnType<typeof parseSocialLinks>
  warnings: string[]
}

const OFFER_TEXT_TO_TAG_ID = new Map(
  VENDOR_TAGS.map((tag) => [tag.text.toLowerCase(), tag.id]),
)

function normalizeLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function parseFloorId(
  floorLabel: string | null,
  config: BranchVendorConfig,
): string | null {
  if (!floorLabel?.trim()) return null

  const normalized = normalizeLabel(floorLabel)
  const mapped = config.floorLabelToId[normalized]
  if (mapped && config.allowedFloorIds.includes(mapped)) return mapped

  const match = normalized.match(/fl\.?\s*([m123])/i)
  const floorId = match?.[1]?.toLowerCase() ?? null
  if (!floorId || !config.allowedFloorIds.includes(floorId)) return null

  return floorId
}

export function parseLotNumber(lot: string | null): number | null {
  if (!lot?.trim()) return null

  const digits = lot.replace(/\D/g, '')
  if (!digits) return null

  const parsed = Number.parseInt(digits, 10)
  return Number.isFinite(parsed) ? parsed : null
}

function parseOfferTexts(offers: string | null): string[] {
  if (!offers?.trim()) return []

  return offers
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

function mapOfferTextsToTagIds(offerTexts: string[]): string[] {
  const tagIds: string[] = []

  for (const offer of offerTexts) {
    const tagId = OFFER_TEXT_TO_TAG_ID.get(normalizeLabel(offer))
    if (tagId) tagIds.push(tagId)
  }

  return [...new Set(tagIds)]
}

export function buildVendorSlug(
  name: string,
  branchSlug: string,
  usedSlugs: Set<string>,
): string {
  const baseSlug = slugify(name)
  if (!baseSlug) {
    const fallback = `vendor-${branchSlug}`
    if (!usedSlugs.has(fallback)) {
      usedSlugs.add(fallback)
      return fallback
    }
    return `${fallback}-${Date.now()}`
  }

  let candidate = `${baseSlug}-${branchSlug}`
  if (!usedSlugs.has(candidate)) {
    usedSlugs.add(candidate)
    return candidate
  }

  let index = 2
  while (usedSlugs.has(`${baseSlug}-${branchSlug}-${index}`)) {
    index += 1
  }

  const slug = `${baseSlug}-${branchSlug}-${index}`
  usedSlugs.add(slug)
  return slug
}

export function mapVendorRow(
  row: VendorCsvRow,
  config: BranchVendorConfig,
  usedSlugs: Set<string>,
): MappedVendor {
  const warnings: string[] = []

  if (row.branchCode !== config.branchCode) {
    warnings.push(`Unexpected branch code: ${row.branchCode}`)
  }

  const floorId = parseFloorId(row.floorLabel, config)
  if (row.floorLabel && !floorId) {
    warnings.push(`Could not parse floor for branch: ${row.floorLabel}`)
  }

  const lotNumber = parseLotNumber(row.lot)
  if (row.lot && lotNumber == null) {
    warnings.push(`Could not parse lot number: ${row.lot}`)
  }

  const offerTexts = parseOfferTexts(row.offers)
  const tagIds = mapOfferTextsToTagIds(offerTexts)

  for (const offer of offerTexts) {
    if (!OFFER_TEXT_TO_TAG_ID.has(normalizeLabel(offer))) {
      warnings.push(`Unknown offer tag: ${offer}`)
    }
  }

  return {
    rowNumber: row.rowNumber,
    branchSlug: config.slug,
    name: row.name,
    slug: buildVendorSlug(row.name, config.slug, usedSlugs),
    description: row.description?.trim() || null,
    mood: row.mood?.trim() || null,
    categoryText: row.category?.replace(/\s+/g, ' ').trim() || null,
    offerTexts,
    tagIds,
    openingHours: row.openingHours?.trim() || null,
    tel: normalizeTelList(row.tel),
    lotNumber,
    floorId,
    social: parseSocialLinks(row.links),
    warnings,
  }
}
