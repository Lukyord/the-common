export type BlogSlugGroupEntry = {
  contentFingerprint: string
  slug: string
  branches: Set<string>
}

export type BlogTitleSlugGroup = {
  baseSlug: string
  entries: BlogSlugGroupEntry[]
}

export type BlogSlugRegistry = {
  assignedSlugs: Set<string>
  byTitle: Map<string, BlogTitleSlugGroup>
}

export function createBlogSlugRegistry(): BlogSlugRegistry {
  return { assignedSlugs: new Set(), byTitle: new Map() }
}

export function normalizeBlogTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ').toLowerCase()
}

function allocateUniqueSlug(baseSlug: string, registry: BlogSlugRegistry): string {
  if (!registry.assignedSlugs.has(baseSlug)) {
    registry.assignedSlugs.add(baseSlug)
    return baseSlug
  }

  let index = 2
  let candidate = `${baseSlug}-${index}`

  while (registry.assignedSlugs.has(candidate)) {
    index += 1
    candidate = `${baseSlug}-${index}`
  }

  registry.assignedSlugs.add(candidate)
  return candidate
}

export function resolveLegacyBlogSlug(args: {
  title: string
  legacySlug: string
  branchSlug: string | null
  contentFingerprint: string
  registry: BlogSlugRegistry
}): { slug: string; mergeBranch: boolean } {
  const { title, legacySlug, branchSlug, contentFingerprint, registry } = args
  const normalizedTitle = normalizeBlogTitle(title)
  let titleGroup = registry.byTitle.get(normalizedTitle)

  if (!titleGroup) {
    const slug = allocateUniqueSlug(legacySlug, registry)
    titleGroup = {
      baseSlug: slug,
      entries: [
        {
          contentFingerprint,
          slug,
          branches: new Set(branchSlug ? [branchSlug] : []),
        },
      ],
    }
    registry.byTitle.set(normalizedTitle, titleGroup)
    return { slug, mergeBranch: false }
  }

  const contentMatch = titleGroup.entries.find(
    (entry) => entry.contentFingerprint === contentFingerprint,
  )

  if (contentMatch) {
    const mergeBranch =
      Boolean(branchSlug) &&
      contentMatch.branches.size > 0 &&
      !contentMatch.branches.has(branchSlug)

    if (branchSlug) {
      contentMatch.branches.add(branchSlug)
    }

    return { slug: contentMatch.slug, mergeBranch }
  }

  const branchSuffix = branchSlug ?? 'branch'
  let candidate = `${titleGroup.baseSlug}-${branchSuffix}`
  candidate = allocateUniqueSlug(candidate, registry)

  titleGroup.entries.push({
    contentFingerprint,
    slug: candidate,
    branches: new Set(branchSlug ? [branchSlug] : []),
  })

  return { slug: candidate, mergeBranch: false }
}
