import fs from 'fs'
import path from 'path'

import { runMigrationScript } from '../lib/cli.js'
import {
  getBranchVendorConfig,
  resolveShopBranchSlugs,
  type ShopBranchSlug,
} from './config/branches.js'
import { parseFloorId, parseLotNumber } from './lib/mapVendorRow.js'
import { loadBranchVendorRows } from './lib/parseVendorCsv.js'

type VendorJson = {
  order: number
  lot: string | null
  lotNumber: number | null
  no: number
  branch: string
  name: string
  description: string | null
  mood: string | null
  category: string | null
  offers: string | null
  openingHours: string | null
  tel: string | null
  links: string | null
  note: string | null
}

function sortVendors(a: VendorJson, b: VendorJson): number {
  const lotA = a.lotNumber
  const lotB = b.lotNumber

  if (lotA != null && lotB != null) {
    if (lotA !== lotB) return lotA - lotB
    return a.no - b.no
  }

  if (lotA != null) return -1
  if (lotB != null) return 1

  const lotStrA = a.lot ?? ''
  const lotStrB = b.lot ?? ''
  if (lotStrA !== lotStrB) return lotStrA.localeCompare(lotStrB)

  return a.no - b.no
}

function exportBranchJson(branchSlug: ShopBranchSlug) {
  const config = getBranchVendorConfig(branchSlug)
  const grouped = new Map<string, { label: string; vendors: VendorJson[] }>()

  for (const row of loadBranchVendorRows(config)) {
    const floorId = parseFloorId(row.floorLabel, config) ?? 'unassigned'
    const label =
      floorId === 'unassigned'
        ? config.floorLabels.unassigned
        : (row.floorLabel?.trim() ?? config.floorLabels[floorId] ?? floorId)

    const vendor: VendorJson = {
      order: 0,
      lot: row.lot,
      lotNumber: parseLotNumber(row.lot),
      no: row.rowNumber,
      branch: row.branchCode,
      name: row.name,
      description: row.description,
      mood: row.mood,
      category: row.category,
      offers: row.offers,
      openingHours: row.openingHours,
      tel: row.tel,
      links: row.links,
      note: row.note,
    }

    const floor = grouped.get(floorId) ?? { label: config.floorLabels[floorId] ?? label, vendors: [] }
    if (!grouped.has(floorId)) grouped.set(floorId, floor)
    floor.vendors.push(vendor)
  }

  const floorIds = [
    ...config.floorOrder.filter((id) => grouped.has(id)),
    ...[...grouped.keys()].filter((id) => !config.floorOrder.includes(id)),
  ]

  const floors = floorIds.map((id) => {
    const floor = grouped.get(id)!
    const vendors = floor.vendors.sort(sortVendors).map((vendor, index) => ({
      ...vendor,
      order: index + 1,
    }))

    return {
      id,
      label: config.floorLabels[id] ?? floor.label,
      vendors,
    }
  })

  const vendorCount = floors.reduce((total, floor) => total + floor.vendors.length, 0)

  fs.writeFileSync(
    config.jsonPath,
    `${JSON.stringify({ branch: config.slug, source: `legacy-db/${path.basename(config.csvPath)}`, floors }, null, 2)}\n`,
    'utf8',
  )

  console.log(`Wrote ${vendorCount} vendors across ${floors.length} floors to ${config.jsonPath}`)
}

async function main() {
  for (const branchSlug of resolveShopBranchSlugs()) {
    exportBranchJson(branchSlug)
  }
}

runMigrationScript(main)
