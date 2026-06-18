import type { MigrationCliOptions } from '../../lib/cli.js'
import { getMigrationCutoffDate } from '../../lib/legacy.js'
import { createLegacySlugRegistry } from '../../lib/slugRegistry.js'
import { getEligibleBlogs, mapLegacyBlog } from './mapLegacyBlog.js'
import { loadLegacyBlogs, selectLegacyBlogsByIndexes } from './loadLegacyBlogs.js'
import type { MappedLegacyBlog } from './types.js'

export type MigrationBlogBatch = {
  legacyTotal: number
  selectedIndexes: number[] | null
  mapped: MappedLegacyBlog[]
  eligible: MappedLegacyBlog[]
}

export type MigrationBatchOptions = {
  indexes?: MigrationCliOptions['indexes']
  limit?: MigrationCliOptions['limit']
}

export function resolveMigrationIndexes(options: MigrationBatchOptions): number[] {
  const { selectedIndexes, eligible } = getMigrationBlogBatch(options)

  if (selectedIndexes) {
    const eligibleIndexes = new Set(
      eligible.map((blog) => blog.legacyIndex).filter((index): index is number => index != null),
    )
    return selectedIndexes.filter((index) => eligibleIndexes.has(index))
  }

  return eligible
    .map((blog) => blog.legacyIndex)
    .filter((index): index is number => index != null)
}

export function getMigrationBlogBatch(
  options: MigrationBatchOptions = {},
  cutoff = getMigrationCutoffDate(),
): MigrationBlogBatch {
  const legacyBlogs = loadLegacyBlogs()
  const indexedBlogs = options.indexes
    ? selectLegacyBlogsByIndexes(legacyBlogs, options.indexes)
    : legacyBlogs.map((blog, legacyIndex) => ({ blog, legacyIndex }))

  const slugRegistry = createLegacySlugRegistry()
  const mapped = indexedBlogs.map(({ blog, legacyIndex }) => ({
    ...mapLegacyBlog(blog, slugRegistry, cutoff),
    legacyIndex,
  }))

  let eligible = getEligibleBlogs(mapped)
  if (options.limit) {
    eligible = eligible.slice(0, options.limit)
  }

  return {
    legacyTotal: legacyBlogs.length,
    selectedIndexes: options.indexes ? indexedBlogs.map(({ legacyIndex }) => legacyIndex) : null,
    mapped,
    eligible,
  }
}
