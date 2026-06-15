import {
  LEGACY_CATEGORY_MAP,
  type LegacyCategory,
} from '../config/legacy-tag-map.js'
import { MAIN_TAG_PRIORITY } from '../config/constants.js'
import type { LegacyEvent, MappedLegacyTags } from './types.js'

function collectLegacyTags(event: LegacyEvent): string[] {
  return [...new Set([...(event.categories ?? []), event.category].filter(Boolean) as string[])]
}

export function mapLegacyTags(event: LegacyEvent): MappedLegacyTags {
  const legacyTags = collectLegacyTags(event)
  const mainTags = new Set<string>()
  const subTags = new Set<string>()
  const unmappedTags: string[] = []

  for (const tag of legacyTags) {
    const mapping = LEGACY_CATEGORY_MAP[tag as LegacyCategory]

    if (!mapping) {
      unmappedTags.push(tag)
      continue
    }

    if (mapping.mainTag) mainTags.add(mapping.mainTag)
    if (mapping.subTag) subTags.add(mapping.subTag)
  }

  const mainTag = MAIN_TAG_PRIORITY.find((tag) => mainTags.has(tag)) ?? null
  const resolvedSubTags = [...subTags].slice(0, 3)
  const droppedSubTags = [...subTags].slice(3)

  return {
    legacyTags,
    mainTag,
    subTags: resolvedSubTags,
    droppedSubTags,
    unmappedTags,
  }
}
