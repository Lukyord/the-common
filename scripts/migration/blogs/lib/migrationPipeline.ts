import type { Blog } from '@/payload-types'

import { webpFilenameForLegacyPath } from '../../lib/media/convertImageToWebp.js'
import type { MigrationCliOptions } from '../../lib/cli.js'
import { formatBlogsMigrateCommand, printDryRunBanner } from '../../lib/cli.js'
import { writeJsonReport } from '../../lib/fs.js'
import { cleanupBlogMediaCache } from './cleanupMediaCache.js'
import {
  ensureManifestImageCached,
  getBlogsManifestPath,
  getValidatedMediaIdFromManifest,
  loadMediaManifest,
  recordSlugFingerprint,
  sanitizeMediaManifest,
  saveMediaManifest,
  uploadLegacyMediaFile,
  type MediaUploadManifest,
} from './blogsMedia.js'
import { legacyPathToUrl, listUniqueMigrationImagePaths } from './legacyImages.js'
import { getMigrationBlogBatch, resolveMigrationIndexes } from './migrationBatch.js'
import {
  ANALYSIS_REPORT_PATH,
  BLOGS_MAPPED_REPORT_PATH,
  IMPORT_REPORT_PATH,
  PROGRESS_REPORT_PATH,
} from './reportPaths.js'
import { resolveBlogGalleryMediaIds } from './resolveGalleryMediaIds.js'
import type { MappedLegacyBlog, MigrationAnalysis } from './types.js'
import { retryTransient } from '../../lib/retryTransient.js'
import { getMigrationCutoffDate, toIsoDate } from '../../lib/legacy.js'
import { REPORTS_DIR } from '../config/constants.js'

export type SingleBlogMigrationResult = {
  legacyIndex: number
  skipped: boolean
  skippedReason?: string
  title?: string
  slug?: string
  mediaUploaded?: number
  mediaCached?: number
  mediaFailed?: number
  imported?: boolean
  skippedExisting?: boolean
  branchMerged?: boolean
  cacheCleaned?: number
}

export type AnalyzeStepResult = {
  analysis: MigrationAnalysis
  eligibleCount: number
  selectedIndexes: number[] | null
}

export function runAnalyzeStep(options: MigrationCliOptions): AnalyzeStepResult {
  const cutoff = getMigrationCutoffDate()
  const { legacyTotal, selectedIndexes, mapped, eligible } = getMigrationBlogBatch(options, cutoff)
  const discarded = mapped.filter((blog) => blog.skippedReason)

  const analysis: MigrationAnalysis = {
    generatedAt: new Date().toISOString(),
    cutoffDate: toIsoDate(cutoff),
    totals: {
      legacy: legacyTotal,
      selected: mapped.length,
      eligible: eligible.length,
      discardedDeleted: discarded.filter((blog) => blog.skippedReason?.includes('deleted')).length,
      discardedNoTitle: discarded.filter((blog) => blog.skippedReason?.includes('Missing title'))
        .length,
      discardedByAge: discarded.filter((blog) => blog.skippedReason?.includes('before cutoff'))
        .length,
      discardedNoDate: discarded.filter((blog) =>
        blog.skippedReason?.includes('Missing published date'),
      ).length,
      withMediaPath: eligible.filter((blog) => blog.mediaPath).length,
      withGallery: eligible.filter((blog) => blog.galleryPaths.length > 0).length,
      duplicateSlugsResolved: eligible.filter((blog) => blog.slug !== blog.legacySlug).length,
      unknownBranch: eligible.filter((blog) =>
        blog.warnings.some((warning) => warning.startsWith('Unknown branch')),
      ).length,
    },
    warnings: [],
    sampleEligible: eligible.slice(0, 10),
    sampleDiscarded: discarded.slice(0, 20).map((blog) => ({
      title: blog.title,
      reason: blog.skippedReason ?? 'Unknown',
      legacyIndex: blog.legacyIndex,
    })),
  }

  if (selectedIndexes) {
    analysis.warnings.push(`Selected legacy indexes: ${selectedIndexes.join(', ')}`)
  }

  writeJsonReport(ANALYSIS_REPORT_PATH, analysis)
  writeJsonReport(BLOGS_MAPPED_REPORT_PATH, mapped)

  console.log(`Cutoff date (>=): ${analysis.cutoffDate}`)
  console.log(`Legacy total:     ${analysis.totals.legacy}`)
  if (selectedIndexes) {
    console.log(
      `Selected:         ${analysis.totals.selected} (indexes: ${selectedIndexes.join(', ')})`,
    )
  }
  console.log(`Eligible:         ${analysis.totals.eligible}`)

  return { analysis, eligibleCount: eligible.length, selectedIndexes }
}

async function buildBlogData(
  payload: import('payload').Payload,
  blog: MappedLegacyBlog,
  branchIds: number[],
  manifest: MediaUploadManifest | null,
  remote: boolean,
) {
  const expectedFilename = blog.mediaPath
    ? webpFilenameForLegacyPath(blog.mediaPath, blog.slug)
    : null
  const mediaId = manifest
    ? await getValidatedMediaIdFromManifest(
        payload,
        manifest,
        blog.mediaPath,
        remote ? expectedFilename : null,
      )
    : null
  const galleryIds = await resolveBlogGalleryMediaIds(payload, blog, manifest, mediaId)

  const { htmlToLexicalContent } = await import('../../lib/htmlToLexicalContent.js')

  return {
    title: blog.title,
    slug: blog.slug,
    branch: branchIds.length ? branchIds : undefined,
    publishedDate: blog.publishedDate ?? undefined,
    content: (await htmlToLexicalContent(blog.contentHtml)) ?? undefined,
    media: mediaId ?? undefined,
    gallery: galleryIds.length ? galleryIds : undefined,
  }
}

function getBlogMediaId(media: unknown): number | null {
  if (typeof media === 'number') return media
  if (media && typeof media === 'object' && 'id' in media) {
    const id = (media as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

function getBlogGalleryIds(gallery: unknown): number[] {
  if (!Array.isArray(gallery)) return []

  return gallery
    .map((entry) => {
      if (typeof entry === 'number') return entry
      if (entry && typeof entry === 'object' && 'id' in entry) {
        const id = (entry as { id?: unknown }).id
        return typeof id === 'number' ? id : null
      }
      return null
    })
    .filter((id): id is number => typeof id === 'number')
}

function existingMatchesBlog(
  blog: MappedLegacyBlog,
  existing: Blog,
  manifest: MediaUploadManifest | null,
  ourMediaId: number | null,
  ourGalleryIds: number[],
): boolean {
  const storedFingerprint = manifest?.slugFingerprints?.[existing.slug]
  if (storedFingerprint) {
    return storedFingerprint === blog.fingerprint
  }

  const existingMediaId = getBlogMediaId(existing.media)
  if (existingMediaId !== ourMediaId) return false

  const existingGalleryIds = getBlogGalleryIds(existing.gallery)
  if (JSON.stringify(existingGalleryIds) !== JSON.stringify(ourGalleryIds)) {
    return false
  }

  return (blog.publishedDate ?? null) === (existing.publishedDate ?? null)
}

async function findAvailableSlug(
  payload: import('payload').Payload,
  baseSlug: string,
  legacyId: string,
  reservedSlugs: Set<string>,
): Promise<string> {
  const usedSlugs = new Set(reservedSlugs)

  async function isSlugTaken(slug: string): Promise<boolean> {
    if (usedSlugs.has(slug)) return true

    const { docs } = await payload.find({
      collection: 'blogs',
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
      overrideAccess: true,
    })

    return docs.length > 0
  }

  if (!(await isSlugTaken(baseSlug))) {
    usedSlugs.add(baseSlug)
    return baseSlug
  }

  let candidate = `${baseSlug}-${legacyId.slice(-6)}`
  let index = 2

  while (await isSlugTaken(candidate)) {
    candidate = `${baseSlug}-${legacyId.slice(-6)}-${index}`
    index += 1
  }

  usedSlugs.add(candidate)
  return candidate
}

async function resolveImportSlug(
  blog: MappedLegacyBlog,
  payload: import('payload').Payload,
  manifest: MediaUploadManifest | null,
): Promise<string> {
  const reservedSlugs = new Set(Object.keys(manifest?.slugFingerprints ?? {}))

  const { docs: existingDocs } = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: blog.slug } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  if (existingDocs[0]) {
    const existing = existingDocs[0] as Blog
    const storedFingerprint = manifest?.slugFingerprints?.[existing.slug]
    if (storedFingerprint && storedFingerprint === blog.fingerprint) {
      return blog.slug
    }

    return findAvailableSlug(payload, blog.slug, blog.legacyId, reservedSlugs)
  }

  return findAvailableSlug(payload, blog.slug, blog.legacyId, reservedSlugs)
}

function getBlogBranchIds(branch: unknown): number[] {
  if (!Array.isArray(branch)) return []

  return branch
    .map((entry) => {
      if (typeof entry === 'number') return entry
      if (entry && typeof entry === 'object' && 'id' in entry) {
        const id = (entry as { id?: unknown }).id
        return typeof id === 'number' ? id : null
      }
      return null
    })
    .filter((id): id is number => typeof id === 'number')
}

async function importSingleBlog(
  blog: MappedLegacyBlog,
  manifest: MediaUploadManifest | null,
  payload: import('payload').Payload,
  branchCache: Map<string, number | null>,
  remote: boolean,
): Promise<{
  imported: boolean
  skippedExisting: boolean
  branchMerged: boolean
  slug: string
  error?: string
}> {
  const { resolveBranchId } = await import('../../lib/getPayloadLocal.js')

  let branchId: number | null = null
  if (blog.branchSlug) {
    if (!branchCache.has(blog.branchSlug)) {
      branchCache.set(blog.branchSlug, await resolveBranchId(payload, blog.branchSlug))
    }
    branchId = branchCache.get(blog.branchSlug) ?? null
    if (!branchId) {
      return {
        imported: false,
        skippedExisting: false,
        branchMerged: false,
        slug: blog.slug,
        error: `Branch not found: ${blog.branchSlug}`,
      }
    }
  }

  const slug = await resolveImportSlug(blog, payload, manifest)

  if (slug !== blog.slug) {
    console.log(`  slug: reassigned ${blog.slug} -> ${slug}`)
  }

  if (blog.mediaPath && manifest) {
    const expectedFilename = webpFilenameForLegacyPath(blog.mediaPath, slug)
    const mediaId = await getValidatedMediaIdFromManifest(
      payload,
      manifest,
      blog.mediaPath,
      remote ? expectedFilename : null,
    )
    if (!mediaId) {
      return {
        imported: false,
        skippedExisting: false,
        branchMerged: false,
        slug,
        error: 'Missing media in manifest',
      }
    }
  }

  const expectedCardFilename = webpFilenameForLegacyPath(blog.mediaPath ?? '', slug)
  const ourMediaId = manifest
    ? await getValidatedMediaIdFromManifest(
        payload,
        manifest,
        blog.mediaPath,
        remote ? expectedCardFilename : null,
      )
    : null
  const ourGalleryIds = await resolveBlogGalleryMediaIds(payload, blog, manifest, ourMediaId)

  const { docs: existingDocs } = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: slug } },
    limit: 1,
    pagination: false,
    overrideAccess: true,
  })

  if (existingDocs[0]) {
    const existing = existingDocs[0] as Blog
    const existingBranchIds = getBlogBranchIds(existing.branch)
    const matches = existingMatchesBlog(blog, existing, manifest, ourMediaId, ourGalleryIds)

    if (matches) {
      if (branchId && !existingBranchIds.includes(branchId)) {
        await payload.update({
          collection: 'blogs',
          id: existing.id,
          data: { branch: [...existingBranchIds, branchId] },
          overrideAccess: true,
        })

        if (manifest) {
          recordSlugFingerprint(manifest, slug, blog.fingerprint)
          saveMediaManifest(manifest, remote)
        }

        return { imported: false, skippedExisting: false, branchMerged: true, slug }
      }

      return { imported: false, skippedExisting: true, branchMerged: false, slug }
    }
  }

  const data = await buildBlogData(
    payload,
    { ...blog, slug },
    branchId ? [branchId] : [],
    manifest,
    remote,
  )

  try {
    await payload.create({
      collection: 'blogs',
      data,
      overrideAccess: true,
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'data' in error) {
      const payloadError = error as { data?: { errors?: Array<{ path?: string; message?: string }> } }
      const details = payloadError.data?.errors
        ?.map((entry) => `${entry.path ?? 'unknown'}: ${entry.message ?? 'invalid'}`)
        .join('; ')

      if (details) {
        throw new Error(`Blog create failed: ${details}`)
      }
    }

    throw error
  }

  if (manifest) {
    recordSlugFingerprint(manifest, slug, blog.fingerprint)
    saveMediaManifest(manifest, remote)
  }

  return { imported: true, skippedExisting: false, branchMerged: false, slug }
}

async function migrateSingleBlogIndex(
  options: MigrationCliOptions,
  legacyIndex: number,
  manifest: MediaUploadManifest,
  payload: import('payload').Payload | null,
  branchCache: Map<string, number | null>,
): Promise<SingleBlogMigrationResult> {
  const singleOptions: MigrationCliOptions = {
    ...options,
    indexes: [legacyIndex],
    limit: null,
  }

  const { eligible, mapped } = getMigrationBlogBatch(singleOptions)
  const mappedBlog = mapped[0]

  if (!mappedBlog) {
    throw new Error(`Legacy index ${legacyIndex} is out of range`)
  }

  if (eligible.length === 0) {
    const reason = mappedBlog.skippedReason ?? 'Not eligible for migration'
    console.log(`  Skipped: ${reason}`)
    return {
      legacyIndex,
      skipped: true,
      skippedReason: reason,
      title: mappedBlog.title,
      slug: mappedBlog.slug,
    }
  }

  let blog = eligible[0]
  const downloadOptions = {
    localAssetsDir: options.localAssetsDir ?? undefined,
  }

  if (payload) {
    const importSlug = await resolveImportSlug(blog, payload, manifest)
    if (importSlug !== blog.slug) {
      console.log(`  slug: resolved ${blog.slug} -> ${importSlug}`)
      blog = { ...blog, slug: importSlug }
    }
  }

  console.log(`  ${blog.title}`)
  console.log(`  slug: ${blog.slug}`)
  if (blog.branchSlug) {
    console.log(`  branch: ${blog.branchSlug}`)
  }
  if (blog.publishedDate) {
    console.log(`  published: ${blog.publishedDate}`)
  }
  if (blog.mediaPath) {
    console.log(`  media: ${legacyPathToUrl(blog.mediaPath)}`)
  }
  if (blog.galleryPaths.length) {
    console.log(`  gallery: ${blog.galleryPaths.length} image(s)`)
  }

  const pathToMeta = new Map<string, { alt: string; slug: string; index?: number }>()
  if (blog.mediaPath) {
    pathToMeta.set(blog.mediaPath, { alt: blog.title, slug: blog.slug })
  }
  blog.galleryPaths.forEach((legacyPath, index) => {
    if (!pathToMeta.has(legacyPath)) {
      pathToMeta.set(legacyPath, { alt: blog.title, slug: blog.slug, index })
    }
  })

  const cachePaths = listUniqueMigrationImagePaths([blog])
  for (const legacyPath of cachePaths) {
    const meta = pathToMeta.get(legacyPath)
    if (!meta) continue
    await ensureManifestImageCached(legacyPath, meta.alt, manifest, downloadOptions)
  }
  saveMediaManifest(manifest, options.remote)

  const uploadPaths = listUniqueMigrationImagePaths([blog], manifest)
  let mediaUploaded = 0
  let mediaCached = 0
  let mediaFailed = 0

  for (const legacyPath of uploadPaths) {
    const meta = pathToMeta.get(legacyPath)
    if (!meta) continue

    await uploadLegacyMediaFile(payload, {
      legacyPath,
      alt: meta.alt,
      slug: meta.slug,
      index: meta.index,
      dryRun: options.dryRun,
      manifest,
      downloadOptions,
      expectedFilename: webpFilenameForLegacyPath(legacyPath, meta.slug, meta.index),
      strictMediaReuse: options.remote,
    })

    if (options.dryRun) continue

    const entry = manifest.entries[legacyPath]
    if (entry?.status === 'uploaded') mediaUploaded += 1
    if (entry?.status === 'cached') mediaCached += 1
    if (entry?.status === 'failed') mediaFailed += 1
  }

  saveMediaManifest(manifest, options.remote)

  if (!options.dryRun) {
    console.log(`  media: ${mediaUploaded} uploaded, ${mediaCached} reused, ${mediaFailed} failed`)
    if (mediaFailed > 0) {
      throw new Error(`Media import failed for ${mediaFailed} image(s)`)
    }
  } else {
    console.log(`  media: ${uploadPaths.length} unique image(s) prepared`)
  }

  let imported = false
  let skippedExisting = false
  let branchMerged = false

  if (!options.dryRun) {
    if (!payload) {
      throw new Error('Payload client is required when --write is set')
    }

    const importResult = await importSingleBlog(blog, manifest, payload, branchCache, options.remote)
    if (importResult.error) {
      throw new Error(importResult.error)
    }

    imported = importResult.imported
    skippedExisting = importResult.skippedExisting
    branchMerged = importResult.branchMerged
    if (importResult.slug !== blog.slug) {
      blog = { ...blog, slug: importResult.slug }
    }

    if (branchMerged) {
      console.log(`  blog: branch merged (${blog.branchSlug} added)`)
    } else if (skippedExisting) {
      console.log('  blog: already exists (skipped)')
    } else if (imported) {
      console.log('  blog: created')
    }
  } else {
    console.log('  blog: dry-run preview OK')
  }

  let cacheCleaned = 0
  if (!options.keepCache) {
    cacheCleaned = cleanupBlogMediaCache(manifest, [blog], options.remote)
    if (cacheCleaned > 0) {
      console.log(`  cache: removed ${cacheCleaned} file(s)`)
    }
  }

  return {
    legacyIndex,
    skipped: false,
    title: blog.title,
    slug: blog.slug,
    mediaUploaded,
    mediaCached,
    mediaFailed,
    imported,
    skippedExisting,
    branchMerged,
    cacheCleaned,
  }
}

export async function runMigrationPipeline(options: MigrationCliOptions) {
  if (options.dryRun) {
    printDryRunBanner()
  }

  console.log('\n=== Analyze ===')
  const analyze = runAnalyzeStep(options)
  if (analyze.eligibleCount === 0) {
    throw new Error('No eligible blogs to migrate for the selected indexes/limit')
  }

  const indexes = resolveMigrationIndexes(options)
  if (!indexes.length) {
    throw new Error('No eligible legacy indexes to process')
  }

  console.log(`\nProcessing ${indexes.length} index(es) one at a time: ${indexes.join(', ')}`)

  const manifest: MediaUploadManifest = loadMediaManifest(options.remote) ?? {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    entries: {},
  }

  if (options.remote) {
    console.log(`Manifest: ${getBlogsManifestPath(true)}`)
  }

  const payload = options.dryRun
    ? null
    : await import('../../lib/getPayloadLocal.js').then((m) => m.getMigrationPayload())

  if (!options.dryRun && payload) {
    const staleCount = await sanitizeMediaManifest(payload, manifest)
    if (staleCount > 0) {
      console.log(`Manifest: cleared ${staleCount} stale media reference(s)`)
      saveMediaManifest(manifest, options.remote)
    }
  }

  const branchCache = new Map<string, number | null>()
  const completed: SingleBlogMigrationResult[] = []
  const skipped: SingleBlogMigrationResult[] = []

  for (const legacyIndex of indexes) {
    console.log(`\n=== Index ${legacyIndex} ===`)

    try {
      const result = await retryTransient(
        () => migrateSingleBlogIndex(options, legacyIndex, manifest, payload, branchCache),
        { label: `Index ${legacyIndex}` },
      )

      if (result.skipped) {
        skipped.push(result)
      } else {
        completed.push(result)
      }

      writeJsonReport(PROGRESS_REPORT_PATH, {
        generatedAt: new Date().toISOString(),
        dryRun: options.dryRun,
        completedIndexes: completed.map((item) => item.legacyIndex),
        skippedIndexes: skipped.map((item) => ({
          index: item.legacyIndex,
          reason: item.skippedReason,
        })),
        lastProcessedIndex: legacyIndex,
        status: 'in_progress',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`\nStopped at index ${legacyIndex}: ${message}`)

      writeJsonReport(PROGRESS_REPORT_PATH, {
        generatedAt: new Date().toISOString(),
        dryRun: options.dryRun,
        completedIndexes: completed.map((item) => item.legacyIndex),
        skippedIndexes: skipped.map((item) => ({
          index: item.legacyIndex,
          reason: item.skippedReason,
        })),
        failedIndex: legacyIndex,
        error: message,
        resumeHint: formatBlogsMigrateCommand(options, `--indexes ${legacyIndex}`),
        status: 'failed',
      })

      throw error
    }
  }

  writeJsonReport(PROGRESS_REPORT_PATH, {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    completedIndexes: completed.map((item) => item.legacyIndex),
    skippedIndexes: skipped.map((item) => ({
      index: item.legacyIndex,
      reason: item.skippedReason,
    })),
    status: 'complete',
  })

  writeJsonReport(IMPORT_REPORT_PATH, {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    processed: completed.length + skipped.length,
    created: completed.filter((item) => item.imported || options.dryRun).length,
    skippedExisting: completed.filter((item) => item.skippedExisting).length,
    skippedIneligible: skipped.length,
    blogs: [...completed, ...skipped],
  })

  console.log('\nMigration complete')
  console.log(`Completed: ${completed.length}`)
  console.log(`Skipped:   ${skipped.length}`)
  if (analyze.selectedIndexes) {
    console.log(`Indexes:   ${analyze.selectedIndexes.join(', ')}`)
  }
  console.log(`Reports:   ${REPORTS_DIR}/`)
  if (!options.keepCache && completed.length > 0) {
    console.log('Cache:     cleaned after each index (pass --keep-cache to retain WebP files)')
  }
}
