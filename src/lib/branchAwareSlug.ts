import type { Branch } from '@/payload-types'

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getBranchIds(branch: unknown): number[] {
  if (typeof branch === 'number') return [branch]

  if (branch && typeof branch === 'object' && 'id' in branch) {
    const id = (branch as Branch).id
    return typeof id === 'number' ? [id] : []
  }

  if (!Array.isArray(branch)) return []

  return branch
    .map((item) => {
      if (typeof item === 'number') return item
      if (item && typeof item === 'object' && 'id' in item) return (item as Branch).id
      return null
    })
    .filter((id): id is number => typeof id === 'number')
}

export function getBranchSlugsFromValue(branch: unknown): string[] {
  const slugs: string[] = []

  const addSlug = (item: unknown) => {
    if (!item || typeof item !== 'object' || !('slug' in item)) return
    const slug = (item as Branch).slug
    if (typeof slug === 'string' && slug.trim()) slugs.push(slug)
  }

  if (Array.isArray(branch)) {
    branch.forEach(addSlug)
    return slugs
  }

  addSlug(branch)
  return slugs
}

export async function resolveBranchSlugs(branch: unknown): Promise<string[]> {
  const fromValue = getBranchSlugsFromValue(branch)
  if (fromValue.length > 0) return fromValue

  const branchIds = getBranchIds(branch)
  if (!branchIds.length) return []

  const slugs = await Promise.all(
    branchIds.map((id) =>
      fetch(`/api/branches/${id}?depth=0`, { credentials: 'include' })
        .then((response) => response.json() as Promise<Pick<Branch, 'slug'>>)
        .then((doc) => (typeof doc.slug === 'string' ? doc.slug : null))
        .catch((): null => null),
    ),
  )

  return slugs.filter((slug): slug is string => Boolean(slug))
}

type BranchAwareDoc = {
  id?: number | string
  branch?: unknown
}

async function fetchDocsBySlug(collectionSlug: string, slug: string): Promise<BranchAwareDoc[]> {
  const params = new URLSearchParams({
    'where[slug][equals]': slug,
    depth: '1',
    limit: '25',
  })

  const response = await fetch(`/api/${collectionSlug}?${params}`, { credentials: 'include' })
  if (!response.ok) return []

  const data = (await response.json()) as { docs?: BranchAwareDoc[] }
  return data.docs ?? []
}

function isSameDocument(
  doc: BranchAwareDoc,
  currentDocumentId?: number | string,
): boolean {
  if (currentDocumentId == null || doc.id == null) return false
  return String(doc.id) === String(currentDocumentId)
}

function branchesOverlap(branchA: unknown, branchB: unknown): boolean {
  const idsA = getBranchIds(branchA)
  const idsB = getBranchIds(branchB)
  if (!idsA.length || !idsB.length) return false
  return idsA.some((id) => idsB.includes(id))
}

function hasBranchSlugConflict(
  docs: BranchAwareDoc[],
  currentDocumentId: number | string | undefined,
  branchValue: unknown,
): boolean {
  return docs.some(
    (doc) =>
      !isSameDocument(doc, currentDocumentId) && branchesOverlap(doc.branch, branchValue),
  )
}

export async function resolveBranchAwareSlug(args: {
  sourceText: string
  collectionSlug: string
  currentDocumentId?: number | string
  branchValue?: unknown
}): Promise<string> {
  const baseSlug = slugify(args.sourceText)
  if (!baseSlug) return ''

  const branchSlugs = args.branchValue ? await resolveBranchSlugs(args.branchValue) : []
  const candidates = [baseSlug]

  if (branchSlugs.length > 0) {
    const primaryBranchSlug = [...branchSlugs].sort()[0]
    candidates.push(`${baseSlug}-${primaryBranchSlug}`)
  }

  for (const candidate of candidates) {
    const docs = await fetchDocsBySlug(args.collectionSlug, candidate)
    const otherDocs = docs.filter((doc) => !isSameDocument(doc, args.currentDocumentId))

    if (!otherDocs.length) return candidate

    if (
      args.branchValue &&
      !hasBranchSlugConflict(otherDocs, args.currentDocumentId, args.branchValue)
    ) {
      continue
    }

    if (!args.branchValue) continue

    return resolveNumericSuffix(args.collectionSlug, baseSlug, args.currentDocumentId)
  }

  return resolveNumericSuffix(args.collectionSlug, baseSlug, args.currentDocumentId)
}

async function resolveNumericSuffix(
  collectionSlug: string,
  baseSlug: string,
  currentDocumentId?: number | string,
): Promise<string> {
  let index = 2

  while (index < 1000) {
    const candidate = `${baseSlug}-${index}`
    const docs = await fetchDocsBySlug(collectionSlug, candidate)
    const hasConflict = docs.some((doc) => !isSameDocument(doc, currentDocumentId))

    if (!hasConflict) return candidate
    index += 1
  }

  return `${baseSlug}-${Date.now()}`
}
