import fs from 'fs'

import { LEGACY_EVENTS_PATH } from '../config/constants.js'
import type { LegacyEvent } from './types.js'
import { getLegacyId } from '../../lib/legacy.js'

export function loadLegacyEvents(filePath = LEGACY_EVENTS_PATH): LegacyEvent[] {
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as LegacyEvent[]
}

export type IndexedLegacyEvent = {
  legacyIndex: number
  event: LegacyEvent
}

export function resolveLegacyEventIndex(index: number, total: number): number {
  const resolved = index < 0 ? total + index : index
  if (resolved < 0 || resolved >= total) {
    throw new Error(`Legacy event index out of range: ${index} (total: ${total})`)
  }
  return resolved
}

export function selectLegacyEventsByIndexes(
  events: LegacyEvent[],
  indexes: number[],
): IndexedLegacyEvent[] {
  const seen = new Set<number>()

  return indexes.map((index) => {
    const legacyIndex = resolveLegacyEventIndex(index, events.length)
    if (seen.has(legacyIndex)) {
      throw new Error(`Duplicate legacy event index: ${legacyIndex}`)
    }
    seen.add(legacyIndex)

    return {
      legacyIndex,
      event: events[legacyIndex],
    }
  })
}

export { getLegacyId }
