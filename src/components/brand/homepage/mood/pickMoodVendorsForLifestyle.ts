import { MOOD_CARD_BRANCH_SLUGS } from '@/constants/moodBranches'

import type { MoodVendorCard, MoodVendorPoolItem } from '@/components/brand/homepage/mood/mapMoodVendorCard'

function normalizeName(name: string) {
  return name.trim().toLowerCase()
}

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase()
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export type MoodCardSlot = MoodVendorCard | null

export function buildDefaultMoodCardSlots(defaultVendors: MoodVendorCard[]): MoodCardSlot[] {
  return MOOD_CARD_BRANCH_SLUGS.map((_, index) => defaultVendors[index] ?? null)
}

export function pickMoodVendorsForLifestyle(
  pool: MoodVendorPoolItem[],
  lifestyleId: number,
): MoodCardSlot[] {
  const usedNames = new Set<string>()
  const usedSlugs = new Set<string>()

  return MOOD_CARD_BRANCH_SLUGS.map((branchSlug) => {
    const candidates = pool.filter(
      (item) =>
        item.branchSlug === branchSlug &&
        item.lifestyleIds.includes(lifestyleId) &&
        !usedNames.has(normalizeName(item.name)) &&
        !usedSlugs.has(normalizeSlug(item.slug)),
    )

    if (!candidates.length) return null

    const picked = randomItem(candidates)
    usedNames.add(normalizeName(picked.name))
    usedSlugs.add(normalizeSlug(picked.slug))
    return picked.card
  })
}
