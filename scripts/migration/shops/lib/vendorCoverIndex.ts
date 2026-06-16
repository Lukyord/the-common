import fs from 'fs'
import path from 'path'

import { repoPath } from '../../lib/paths.js'
import { normalizeVendorMatchKey } from './loadLegacyShops.js'

const COVER_NAME_ALIASES: Record<string, string> = {
  "monty's": 'montys',
  "hungry josh's": 'hungry joshs',
  'bun meat and cheese': 'bun meat and cheese',
  'bun meat and cheese ': 'bun meat and cheese',
}

export type VendorCoverIndex = {
  dir: string
  prefix: string
  byKey: Map<string, string>
}

export function getVendorCoverDir(branchSlug: 'thonglor' | 'saladaeng'): string {
  return repoPath(`legacy-db/vendor-cover-${branchSlug}`)
}

export function getVendorCoverPrefix(branchSlug: 'thonglor' | 'saladaeng'): string {
  return branchSlug === 'thonglor' ? 'tl' : 'sd'
}

function coverFileToKey(filename: string, prefix: string): string {
  return filename
    .replace(new RegExp(`^${prefix}-vendor-`, 'i'), '')
    .replace(/\.webp$/i, '')
    .trim()
}

export function buildVendorCoverIndex(
  branchSlug: 'thonglor' | 'saladaeng',
): VendorCoverIndex | null {
  const dir = getVendorCoverDir(branchSlug)
  if (!fs.existsSync(dir)) return null

  const prefix = getVendorCoverPrefix(branchSlug)
  const byKey = new Map<string, string>()

  for (const filename of fs.readdirSync(dir)) {
    if (!filename.toLowerCase().endsWith('.webp')) continue
    const key = normalizeVendorMatchKey(coverFileToKey(filename, prefix))
    byKey.set(key, path.join(dir, filename))
  }

  return { dir, prefix, byKey }
}

export function findVendorCoverPath(
  index: VendorCoverIndex | null,
  vendorName: string,
): string | null {
  if (!index) return null

  const candidates = [
    normalizeVendorMatchKey(vendorName),
    COVER_NAME_ALIASES[normalizeVendorMatchKey(vendorName)],
  ].filter((value): value is string => Boolean(value))

  for (const key of candidates) {
    const match = index.byKey.get(key)
    if (match) return match
  }

  return null
}
