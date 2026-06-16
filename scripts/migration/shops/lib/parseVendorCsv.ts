import fs from 'fs'

import type { BranchVendorConfig } from '../config/branches.js'

export type VendorCsvRow = {
  rowNumber: number
  branchCode: string
  name: string
  description: string | null
  mood: string | null
  category: string | null
  offers: string | null
  openingHours: string | null
  tel: string | null
  lot: string | null
  floorLabel: string | null
  links: string | null
  note: string | null
}

const CSV_HEADERS = [
  'NO.',
  'BRANCH',
  'NAME',
  'DESCRIPTION',
  'IN THE MOOD FOR?',
  'CATEGORY',
  'WHAT WE OFFER',
  'OPENING HOURS',
  'TEL',
  'Lot No.',
  'FLOOR',
  'LINKS',
  'NOTE',
] as const

function parseCsvRows(content: string): string[][] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index]
    const next = content[index + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        currentField += '"'
        index += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        currentField += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      currentRow.push(currentField)
      currentField = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && next === '\n') index += 1
      currentRow.push(currentField)
      currentField = ''
      if (currentRow.some((field) => field.length > 0)) rows.push(currentRow)
      currentRow = []
    } else {
      currentField += char
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField)
    if (currentRow.some((field) => field.length > 0)) rows.push(currentRow)
  }

  return rows
}

function rowToRecord(values: string[]): Record<string, string> {
  const record: Record<string, string> = {}
  for (let index = 0; index < CSV_HEADERS.length; index += 1) {
    record[CSV_HEADERS[index]] = values[index]?.trim() ?? ''
  }
  return record
}

function isDataRow(record: Record<string, string>): boolean {
  const rowNumber = record['NO.']?.trim()
  const name = record.NAME?.trim()

  if (!name || !rowNumber) return false
  if (rowNumber.toUpperCase() === 'SAMPLE') return false
  if (!/^\d+$/.test(rowNumber)) return false

  return true
}

export function loadVendorRows(csvPath: string): VendorCsvRow[] {
  const content = fs.readFileSync(csvPath, 'utf8')
  const [headerRow, ...dataRows] = parseCsvRows(content)

  if (!headerRow?.[0]?.startsWith('NO.')) {
    throw new Error(`Unexpected CSV header in ${csvPath}`)
  }

  return dataRows
    .map((values) => rowToRecord(values))
    .filter(isDataRow)
    .map((record) => ({
      rowNumber: Number.parseInt(record['NO.'], 10),
      branchCode: record.BRANCH,
      name: record.NAME.replace(/\s+/g, ' ').trim(),
      description: record.DESCRIPTION?.trim() || null,
      mood: record['IN THE MOOD FOR?']?.trim() || null,
      category: record.CATEGORY?.trim() || null,
      offers: record['WHAT WE OFFER']?.trim() || null,
      openingHours: record['OPENING HOURS']?.trim() || null,
      tel: record.TEL?.trim() || null,
      lot: record['Lot No.']?.trim() || null,
      floorLabel: record.FLOOR?.trim() || null,
      links: record.LINKS?.trim() || null,
      note: record.NOTE?.trim() || null,
    }))
}

export function loadBranchVendorRows(config: BranchVendorConfig): VendorCsvRow[] {
  return loadVendorRows(config.csvPath)
}
