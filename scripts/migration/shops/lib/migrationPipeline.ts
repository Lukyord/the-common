import type { Vendor } from '@/payload-types'

import type { MigrationCliOptions } from '../../lib/cli.js'
import { printDryRunBanner } from '../../lib/cli.js'
import { writeJsonReport } from '../../lib/fs.js'
import { getMigrationPayload, resolveBranchId } from '../../lib/getPayloadLocal.js'
import { htmlToLexicalContent } from '../../lib/htmlToLexicalContent.js'
import type { BranchVendorConfig, ShopsMigrationOptions } from '../config/branches.js'
import { getCanonicalVendorSlug, mapVendorRow } from './mapVendorRow.js'
import { loadBranchVendorRows } from './parseVendorCsv.js'

type ImportPreviewRow = {
  rowNumber: number
  name: string
  slug: string
  action: 'create' | 'skip-existing' | 'skip-existing-slug' | 'update-description' | 'create-failed'
  reason?: string
  warnings: string[]
  payload?: Record<string, unknown>
}

const CATEGORY_ALIASES: Record<string, string> = {
  thai: 'thai cuisine',
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

async function plainTextToLexicalWithLineBreaks(text: string | null | undefined) {
  if (!text?.trim()) return undefined

  const html = `<p>${text
    .split(/\r?\n/)
    .map((line) => escapeHtml(line.trim()))
    .join('<br>')}</p>`

  return htmlToLexicalContent(html)
}

async function resolveCategoryId(
  payload: Awaited<ReturnType<typeof getMigrationPayload>>,
  categoryText: string | null,
  cache: Map<string, number | null>,
): Promise<number | null> {
  if (!categoryText) return null

  const key = normalizeLookupText(categoryText)
  const lookupKey = CATEGORY_ALIASES[key] ?? key
  if (cache.has(lookupKey)) return cache.get(lookupKey) ?? null

  const { docs } = await payload.find({
    collection: 'vendor-categories',
    limit: 200,
    pagination: false,
    overrideAccess: true,
  })

  const match = docs.find((doc) => normalizeLookupText(doc.text) === lookupKey)
  cache.set(lookupKey, match?.id ?? null)
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

function resolveLotNumberForMigration(
  floorId: string | null,
  lotNumber: number | null,
  seenFloorLots: Set<string>,
): number | null {
  if (!floorId || lotNumber == null) return lotNumber

  const floorLotKey = `${floorId}:${lotNumber}`
  if (seenFloorLots.has(floorLotKey)) return null

  seenFloorLots.add(floorLotKey)
  return lotNumber
}

async function deleteBranchVendors(
  payload: Awaited<ReturnType<typeof getMigrationPayload>>,
  branchId: number,
  dryRun: boolean,
) {
  const { docs } = await payload.find({
    collection: 'vendors',
    where: { branch: { equals: branchId } },
    limit: 500,
    pagination: false,
    overrideAccess: true,
    depth: 0,
  })

  for (const vendor of docs) {
    if (dryRun) {
      console.log(`Would delete: ${vendor.name} (${vendor.slug})`)
      continue
    }

    await payload.delete({
      collection: 'vendors',
      id: vendor.id,
      overrideAccess: true,
    })
    console.log(`Deleted: ${vendor.name} (${vendor.slug})`)
  }

  return docs.length
}

export async function runShopsMigrationPipeline(
  options: MigrationCliOptions,
  config: BranchVendorConfig,
  shopsOptions: ShopsMigrationOptions,
) {
  if (options.dryRun) printDryRunBanner()

  const payload = await getMigrationPayload()
  const branchId = await resolveBranchId(payload, config.slug)

  if (!branchId) {
    throw new Error(`${config.slug} branch not found in D1`)
  }

  if (shopsOptions.replace) {
    const deleted = await deleteBranchVendors(payload, branchId, options.dryRun)
    console.log(
      options.dryRun
        ? `Would delete ${deleted} existing vendor(s) for ${config.slug}`
        : `Deleted ${deleted} existing vendor(s) for ${config.slug}`,
    )
    console.log('')
  }

  const existingVendors = shopsOptions.replace
    ? { docs: [] as Vendor[] }
    : await payload.find({
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

  const existingByLocation = new Map(
    existingVendors.docs
      .map((vendor) => [vendorLocationKey(vendor), vendor] as const)
      .filter((entry): entry is [string, Vendor] => Boolean(entry[0])),
  )

  const rows = loadBranchVendorRows(config)
  const usedSlugs = new Set(existingSlugs)
  const seenFloorLots = new Set(existingLocations)
  const categoryCache = new Map<string, number | null>()
  const lifestyleCache = new Map<string, number | null>()
  const preview: ImportPreviewRow[] = []

  let created = 0
  let skippedExisting = 0
  let skippedExistingSlug = 0
  let updatedDescription = 0
  let failed = 0

  for (const row of rows) {
    const canonicalSlug = getCanonicalVendorSlug(row.name, config.slug)
    if (existingSlugs.has(canonicalSlug)) {
      skippedExistingSlug += 1
      preview.push({
        rowNumber: row.rowNumber,
        name: row.name,
        slug: canonicalSlug,
        action: 'skip-existing-slug',
        reason: `Vendor already exists: ${canonicalSlug}`,
        warnings: [],
      })
      continue
    }

    const mapped = mapVendorRow(row, config, usedSlugs)
    const lotNumber = resolveLotNumberForMigration(mapped.floorId, mapped.lotNumber, seenFloorLots)
    const warnings = [...mapped.warnings]
    const description = await plainTextToLexical(mapped.description)
    const openingHours = await plainTextToLexicalWithLineBreaks(mapped.openingHours)

    const locationKey =
      mapped.floorId && lotNumber != null ? `${mapped.floorId}:${lotNumber}` : null

    if (locationKey && existingLocations.has(locationKey)) {
      const existing = existingByLocation.get(locationKey)

      if (existing && (description || openingHours)) {
        updatedDescription += 1
        preview.push({
          rowNumber: mapped.rowNumber,
          name: mapped.name,
          slug: existing.slug,
          action: 'update-description',
          warnings,
        })

        const updateData: Record<string, unknown> = {}
        if (description) updateData.description = description
        if (openingHours) updateData.openingHours = openingHours

        if (!options.dryRun) {
          await payload.update({
            collection: 'vendors',
            id: existing.id,
            data: updateData,
            overrideAccess: true,
          })
          console.log(`Updated vendor: ${mapped.name} (${existing.slug})`)
        } else {
          console.log(`Would update vendor: ${mapped.name} (${existing.slug})`)
        }
      } else {
        skippedExisting += 1
        preview.push({
          rowNumber: mapped.rowNumber,
          name: mapped.name,
          slug: mapped.slug,
          action: 'skip-existing',
          reason: `Vendor already exists at floor ${mapped.floorId}, lot ${lotNumber}`,
          warnings,
        })
      }
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

    const socialEntries = Object.entries(mapped.social).filter(([, value]) => Boolean(value))

    const data: Record<string, unknown> = {
      name: mapped.name,
      slug: mapped.slug,
      branch: branchId,
      ...(mapped.floorId ? { floor: mapped.floorId } : {}),
      ...(lotNumber != null ? { lotNumber } : {}),
      ...(description ? { description } : {}),
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

    const previewRow: ImportPreviewRow = {
      rowNumber: mapped.rowNumber,
      name: mapped.name,
      slug: mapped.slug,
      action: 'create',
      warnings,
      payload: data,
    }
    preview.push(previewRow)

    if (!options.dryRun) {
      try {
        await payload.create({
          collection: 'vendors',
          data: data as never,
          overrideAccess: true,
        })
        if (locationKey) existingLocations.add(locationKey)
        usedSlugs.add(mapped.slug)
        created += 1
        console.log(`Created: ${mapped.name} (${mapped.slug})`)
      } catch (error) {
        failed += 1
        const message = error instanceof Error ? error.message : String(error)
        previewRow.action = 'create-failed'
        previewRow.reason = message
        console.error(`Failed: ${mapped.name} (${mapped.slug}) — ${message}`)
      }
    } else {
      created += 1
      console.log(`Would create: ${mapped.name} (${mapped.slug})`)
    }
  }

  writeJsonReport(config.importPreviewPath, {
    generatedAt: new Date().toISOString(),
    branch: config.slug,
    dryRun: options.dryRun,
    totals: {
      sourceRows: rows.length,
      create: created,
      skipExisting: skippedExisting,
      skipExistingSlug: skippedExistingSlug,
      updateDescription: updatedDescription,
      failed,
    },
    rows: preview,
  })

  console.log('')
  console.log(`Branch:           ${config.slug}`)
  console.log(`Source rows:      ${rows.length}`)
  console.log(`Create:           ${created}`)
  console.log(`Update desc:      ${updatedDescription}`)
  console.log(`Skip (location):  ${skippedExisting}`)
  console.log(`Skip (slug):      ${skippedExistingSlug}`)
  console.log(`Failed:           ${failed}`)
  console.log(`Preview report:   ${config.importPreviewPath}`)
}
