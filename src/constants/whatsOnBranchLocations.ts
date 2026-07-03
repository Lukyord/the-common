export const WHATS_ON_BRANCH_LOCATION_FIELDS = [
  { slug: 'thonglor', name: 'thonglor', label: 'Thonglor Location' },
  { slug: 'saladaeng', name: 'saladaeng', label: 'Saladaeng Location' },
  { slug: 'cloud-11', name: 'cloud11', label: 'Cloud11 Location' },
] as const

export type WhatsOnBranchLocationSlug = (typeof WHATS_ON_BRANCH_LOCATION_FIELDS)[number]['slug']

type WhatsOnBranchLocationsValue = Partial<
  Record<(typeof WHATS_ON_BRANCH_LOCATION_FIELDS)[number]['name'], string | null | undefined>
>

export function getWhatsOnBranchLocationText(
  slug: string,
  branchLocations?: WhatsOnBranchLocationsValue | null,
): string | null {
  if (!branchLocations) return null

  const field = WHATS_ON_BRANCH_LOCATION_FIELDS.find((item) => item.slug === slug)
  if (!field) return null

  const value = branchLocations[field.name]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}
