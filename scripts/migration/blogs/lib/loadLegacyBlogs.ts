import fs from 'fs'

import { LEGACY_BLOGS_PATH } from '../config/constants.js'
import type { LegacyBlog } from './types.js'
import { getLegacyId } from '../../lib/legacy.js'

export function loadLegacyBlogs(filePath = LEGACY_BLOGS_PATH): LegacyBlog[] {
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as LegacyBlog[]
}

export type IndexedLegacyBlog = {
  legacyIndex: number
  blog: LegacyBlog
}

export function resolveLegacyBlogIndex(index: number, total: number): number {
  const resolved = index < 0 ? total + index : index
  if (resolved < 0 || resolved >= total) {
    throw new Error(`Legacy blog index out of range: ${index} (total: ${total})`)
  }
  return resolved
}

export function selectLegacyBlogsByIndexes(
  blogs: LegacyBlog[],
  indexes: number[],
): IndexedLegacyBlog[] {
  const seen = new Set<number>()

  return indexes.map((index) => {
    const legacyIndex = resolveLegacyBlogIndex(index, blogs.length)
    if (seen.has(legacyIndex)) {
      throw new Error(`Duplicate legacy blog index: ${legacyIndex}`)
    }
    seen.add(legacyIndex)

    return {
      legacyIndex,
      blog: blogs[legacyIndex],
    }
  })
}

export { getLegacyId }
