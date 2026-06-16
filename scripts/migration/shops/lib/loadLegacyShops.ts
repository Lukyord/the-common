import fs from 'fs'

import { LEGACY_SHOPS_PATH } from '../config/media.js'

export type LegacyShop = {
  name: string
  slug: string
  branch: string
  images: string[]
  imagePath: string | null
}

export type LegacyShopIndex = {
  byName: Map<string, LegacyShop>
  bySlug: Map<string, LegacyShop>
  byBranch: Map<string, LegacyShop[]>
}

const VENDOR_TO_LEGACY_NAME_ALIASES: Record<string, string> = {
  '7suns': 'seven suns',
  'gyuto kome': 'gyoto kome',
  tbc: 'the beer cap',
  'ridar by maw10': 'maw10',
}

export function normalizeVendorMatchKey(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/&/g, 'and')
    .replace(/^thecommons\s+/, '')
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function loadLegacyShops(shopsPath = LEGACY_SHOPS_PATH): LegacyShop[] {
  const raw = JSON.parse(fs.readFileSync(shopsPath, 'utf8')) as Array<{
    name?: string
    slug?: string
    branch?: string
    images?: string[]
    imagePath?: string | null
  }>

  return raw
    .filter((shop) => shop.name && shop.branch)
    .map((shop) => ({
      name: shop.name!.trim(),
      slug: shop.slug?.trim() ?? '',
      branch: shop.branch!.trim(),
      images: (shop.images ?? []).filter((url) => typeof url === 'string' && url.trim()),
      imagePath: shop.imagePath?.trim() || null,
    }))
}

export function buildLegacyShopIndex(shops: LegacyShop[]): LegacyShopIndex {
  const byName = new Map<string, LegacyShop>()
  const bySlug = new Map<string, LegacyShop>()
  const byBranch = new Map<string, LegacyShop[]>()

  for (const shop of shops) {
    byName.set(`${shop.branch}:${normalizeVendorMatchKey(shop.name)}`, shop)
    if (shop.slug) {
      bySlug.set(`${shop.branch}:${shop.slug}`, shop)
    }

    const branchShops = byBranch.get(shop.branch) ?? []
    branchShops.push(shop)
    byBranch.set(shop.branch, branchShops)
  }

  return { byName, bySlug, byBranch }
}

export function getLegacyShopGalleryUrls(shop: LegacyShop): string[] {
  if (shop.images.length) return shop.images
  if (shop.imagePath) return [shop.imagePath]
  return []
}

function vendorSlugBase(vendorSlug: string, branchSlug: string): string {
  return vendorSlug.replace(new RegExp(`-${branchSlug}(-\\d+)?$`), '')
}

export function findLegacyShop(
  index: LegacyShopIndex,
  branchSlug: string,
  vendorName: string,
  vendorSlug?: string,
): LegacyShop | null {
  const vendorKey = normalizeVendorMatchKey(vendorName)

  const direct = index.byName.get(`${branchSlug}:${vendorKey}`)
  if (direct) return direct

  const alias = VENDOR_TO_LEGACY_NAME_ALIASES[vendorKey]
  if (alias) {
    const aliasMatch = index.byName.get(`${branchSlug}:${normalizeVendorMatchKey(alias)}`)
    if (aliasMatch) return aliasMatch
  }

  if (vendorSlug) {
    const baseSlug = vendorSlugBase(vendorSlug, branchSlug)
    const slugMatch = index.bySlug.get(`${branchSlug}:${baseSlug}`)
    if (slugMatch) return slugMatch

    for (const shop of index.byBranch.get(branchSlug) ?? []) {
      if (shop.slug === baseSlug || shop.slug.endsWith(`-${baseSlug}`)) {
        return shop
      }
    }
  }

  const branchShops = index.byBranch.get(branchSlug) ?? []

  const prefixMatch = branchShops.find((shop) => {
    const shopKey = normalizeVendorMatchKey(shop.name)
    return shopKey.startsWith(`${vendorKey} `)
  })
  if (prefixMatch) return prefixMatch

  const suffixMatch = branchShops.find((shop) => {
    const shopKey = normalizeVendorMatchKey(shop.name)
    return shopKey.endsWith(` ${vendorKey}`)
  })
  if (suffixMatch) return suffixMatch

  return null
}
