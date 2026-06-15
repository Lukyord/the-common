export type SlugGroup = {
  slug: string
  legacySlug: string
  fingerprint: string
  branches: Set<string>
}

export type LegacySlugRegistry = {
  assignedSlugs: Set<string>
  groups: SlugGroup[]
}

export function createLegacySlugRegistry(): LegacySlugRegistry {
  return { assignedSlugs: new Set(), groups: [] }
}

function allocateUniqueSlug(
  baseSlug: string,
  legacyId: string,
  registry: LegacySlugRegistry,
): string {
  let candidate = `${baseSlug}-${legacyId.slice(-6)}`
  let index = 2

  while (registry.assignedSlugs.has(candidate)) {
    candidate = `${baseSlug}-${legacyId.slice(-6)}-${index}`
    index += 1
  }

  registry.assignedSlugs.add(candidate)
  return candidate
}

export function resolveLegacyEventSlug(
  legacySlug: string,
  branchSlug: string,
  legacyId: string,
  fingerprint: string,
  registry: LegacySlugRegistry,
): string {
  const matchingGroup = registry.groups.find(
    (group) => group.legacySlug === legacySlug && group.fingerprint === fingerprint,
  )

  if (matchingGroup) {
    if (!matchingGroup.branches.has(branchSlug)) {
      matchingGroup.branches.add(branchSlug)
      return matchingGroup.slug
    }

    const slug = allocateUniqueSlug(legacySlug, legacyId, registry)
    registry.groups.push({
      slug,
      legacySlug,
      fingerprint,
      branches: new Set([branchSlug]),
    })
    return slug
  }

  const slug = registry.assignedSlugs.has(legacySlug)
    ? allocateUniqueSlug(legacySlug, legacyId, registry)
    : legacySlug

  registry.groups.push({
    slug,
    legacySlug,
    fingerprint,
    branches: new Set([branchSlug]),
  })
  registry.assignedSlugs.add(slug)
  return slug
}

export function resolveUniqueSlug(baseSlug: string, legacyId: string, usedSlugs: Set<string>): string {
  if (!usedSlugs.has(baseSlug)) {
    usedSlugs.add(baseSlug)
    return baseSlug
  }

  const suffix = legacyId.slice(-6)
  let candidate = `${baseSlug}-${suffix}`
  let index = 2

  while (usedSlugs.has(candidate)) {
    candidate = `${baseSlug}-${suffix}-${index}`
    index += 1
  }

  usedSlugs.add(candidate)
  return candidate
}
