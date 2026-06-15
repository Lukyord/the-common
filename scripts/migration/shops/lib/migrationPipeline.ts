import type { Vendor } from '@/payload-types'

import type { MigrationCliOptions } from '../../lib/cli.js'
import { printDryRunBanner } from '../../lib/cli.js'
import { writeJsonReport } from '../../lib/fs.js'
import { getMigrationPayload, resolveBranchId } from '../../lib/getPayloadLocal.js'
import { htmlToLexicalContent } from '../../lib/htmlToLexicalContent.js'
import { IMPORT_PREVIEW_PATH } from '../config/constants.js'
import { mapThonglorVendorRow } from './mapThonglorVendor.js'
import { loadThonglorVendorRows } from './parseThonglorVendorsCsv.js'

type ImportPreviewRow = {
  rowNumber: number
  name: string
  slug: string
  action: 'create' | 'skip-existing'
  reason?: string
  warnings: string[]
  payload?: Record<string, unknown>
}

function normalizeLookupText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function plainTextToLexical(text: string | null | undefined) {
  if (!text?.trim()) return undefined

  const html = text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')

  return htmlToLexicalContent(html)
}

async function resolveCategoryId(
  payload: Awaited<ReturnType<typeof getMigrationPayload>>,
  categoryText: string | null,
  cache: Map<string, number | null>,
): Promise<number | null> {
  if (!categoryText) return null

  const key = normalizeLookupText(categoryText)
  if (cache.has(key)) return cache.get(key) ?? null

  const { docs } = await payload.find({
    collection: 'vendor-categories',
    limit: 200,
    pagination: false,
    overrideAccess: true,
  })

  const match = docs.find((doc) => normalizeLookupText(doc.text) === key)
  cache.set(key, match?.id ?? null)
  return match?.id ?? null
}

async function resolveLifestyleId(
  payload: Awaited<ReturnType<typeof getMigrationPayload>>,
  moodText: string | null,
  cache: Map<string, number | null>,
): Promise<number | null> {
  if (!moodText) return null

  const key = normalizeLookupText(moodText)
  if (cache.has(key)) return cache.get(key) ?? null

  const { docs } = await payload.find({
    collection: 'lifestyle',
    limit: 200,
    pagination: false,
    overrideAccess: true,
  })

  const match = docs.find((doc) => normalizeLookupText(doc.text) === key)
  cache.set(key, match?.id ?? null)
  return match?.id ?? null
}

function vendorLocationKey(vendor: Pick<Vendor, 'floor' | 'lotNumber'>): string | null {
  if (!vendor.floor || vendor.lotNumber == null) return null
  return `${vendor.floor}:${vendor.lotNumber}`
}

export async function runShopsMigrationPipeline(options: MigrationCliOptions) {
  if (options.dryRun) printDryRunBanner()

  const payload = await getMigrationPayload()
  const branchId = await resolveBranchId(payload, 'thonglor')

  if (!branchId) {
    throw new Error('Thonglor branch not found in D1')
  }

  const existingVendors = await payload.find({
    collection: 'vendors',
    where: { branch: { equals: branchId } },
    limit: 500,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  const existingSlugs = new Set(
    (
      await payload.find({
        collection: 'vendors',
        limit: 1000,
        pagination: false,
        overrideAccess: true,
        depth: 0,
      })
    ).docs.map((vendor) => vendor.slug),
  )

  const existingLocations = new Set(
    existingVendors.docs
      .map((vendor) => vendorLocationKey(vendor))
      .filter((value): value is string => Boolean(value)),
  )

  const rows = loadThonglorVendorRows()
  const usedSlugs = new Set(existingSlugs)
  const categoryCache = new Map<string, number | null>()
  const lifestyleCache = new Map<string, number | null>()
  const preview: ImportPreviewRow[] = []

  let created = 0
  let skippedExisting = 0

  for (const row of rows) {
    const mapped = mapThonglorVendorRow(row, usedSlugs)
    const warnings = [...mapped.warnings]

    const locationKey =
      mapped.floorId && mapped.lotNumber != null
        ? `${mapped.floorId}:${mapped.lotNumber}`
        : null

    if (locationKey && existingLocations.has(locationKey)) {
      skippedExisting += 1
      preview.push({
        rowNumber: mapped.rowNumber,
        name: mapped.name,
        slug: mapped.slug,
        action: 'skip-existing',
        reason: `Vendor already exists at floor ${mapped.floorId}, lot ${mapped.lotNumber}`,
        warnings,
      })
      continue
    }

    const categoryId = await resolveCategoryId(payload, mapped.categoryText, categoryCache)
    if (mapped.categoryText && !categoryId) {
      warnings.push(`Category not found: ${mapped.categoryText}`)
    }

    const lifestyleId = await resolveLifestyleId(payload, mapped.mood, lifestyleCache)
    if (mapped.mood && !lifestyleId) {
      warnings.push(`Lifestyle not found: ${mapped.mood}`)
    }

    const openingHours = await plainTextToLexical(mapped.openingHours)
    const socialEntries = Object.entries(mapped.social).filter(([, value]) => Boolean(value))

    const data: Record<string, unknown> = {
      name: mapped.name,
      slug: mapped.slug,
      branch: branchId,
      ...(mapped.floorId ? { floor: mapped.floorId } : {}),
      ...(mapped.lotNumber != null ? { lotNumber: mapped.lotNumber } : {}),
      ...(categoryId ? { category: [categoryId] } : {}),
      ...(lifestyleId ? { lifestyles: [lifestyleId] } : {}),
      ...(mapped.tagIds.length ? { tags: mapped.tagIds } : {}),
      ...(openingHours ? { openingHours } : {}),
      ...(mapped.tel.length ? { tel: mapped.tel } : {}),
      ...(socialEntries.length
        ? {
            social: Object.fromEntries(socialEntries),
          }
        : {}),
    }

    preview.push({
      rowNumber: mapped.rowNumber,
      name: mapped.name,
      slug: mapped.slug,
      action: 'create',
      warnings,
      payload: data,
    })

    if (!options.dryRun) {
      await payload.create({
        collection: 'vendors',
        data: data as never,
        overrideAccess: true,
      })
      if (locationKey) existingLocations.add(locationKey)
      created += 1
      console.log(`Created: ${mapped.name} (${mapped.slug})`)
    } else {
      created += 1
      console.log(`Would create: ${mapped.name} (${mapped.slug})`)
    }
  }

  writeJsonReport(IMPORT_PREVIEW_PATH, {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    totals: {
      sourceRows: rows.length,
      create: created,
      skipExisting: skippedExisting,
    },
    rows: preview,
  })

  console.log('')
  console.log(`Source rows:      ${rows.length}`)
  console.log(`Create:           ${created}`)
  console.log(`Skip (existing):  ${skippedExisting}`)
  console.log(`Preview report:   ${IMPORT_PREVIEW_PATH}`)
}
