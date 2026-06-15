import { VENDOR_TAGS } from '@/constants/vendorTags'
import { slugify } from '@/lib/branchAwareSlug'

import { BRANCH_CODE_TO_SLUG } from '../config/constants.js'
import { normalizeTelList } from './normalizeTel.js'
import { parseSocialLinks } from './parseSocialLinks.js'
import type { ThonglorVendorCsvRow } from './parseThonglorVendorsCsv.js'

export type MappedThonglorVendor = {
  rowNumber: number
  branchSlug: string
  name: string
  slug: string
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

const FLOOR_LABEL_TO_ID: Record<string, string> = {
  'village (fl. 1)': '1',
  'market (fl. m)': 'm',
  'play yard (fl.2)': '2',
  'play yard (fl. 2)': '2',
  'top yard (fl.3)': '3',
  'top yard (fl. 3)': '3',
}

const OFFER_TEXT_TO_TAG_ID = new Map(
  VENDOR_TAGS.map((tag) => [tag.text.toLowerCase(), tag.id]),
)

function normalizeLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function parseFloorId(floorLabel: string | null): string | null {
  if (!floorLabel?.trim()) return null

  const normalized = normalizeLabel(floorLabel)
  if (FLOOR_LABEL_TO_ID[normalized]) return FLOOR_LABEL_TO_ID[normalized]

  const match = normalized.match(/fl\.?\s*([m123])/i)
  return match?.[1]?.toLowerCase() ?? null
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

export function buildVendorSlug(name: string, usedSlugs: Set<string>): string {
  const baseSlug = slugify(name)
  if (!baseSlug) return `vendor-${Date.now()}`

  if (!usedSlugs.has(baseSlug)) {
    usedSlugs.add(baseSlug)
    return baseSlug
  }

  let index = 2
  while (usedSlugs.has(`${baseSlug}-${index}`)) {
    index += 1
  }

  const slug = `${baseSlug}-${index}`
  usedSlugs.add(slug)
  return slug
}

export function mapThonglorVendorRow(
  row: ThonglorVendorCsvRow,
  usedSlugs: Set<string>,
): MappedThonglorVendor {
  const warnings: string[] = []
  const branchSlug = BRANCH_CODE_TO_SLUG[row.branchCode]

  if (!branchSlug) {
    warnings.push(`Unknown branch code: ${row.branchCode}`)
  }

  const floorId = parseFloorId(row.floorLabel)
  if (row.floorLabel && !floorId) {
    warnings.push(`Could not parse floor: ${row.floorLabel}`)
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
    branchSlug: branchSlug ?? 'thonglor',
    name: row.name,
    slug: buildVendorSlug(row.name, usedSlugs),
    mood: row.mood?.trim() || null,
    categoryText: row.category?.trim().replace(/\s+/g, ' ') || null,
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
