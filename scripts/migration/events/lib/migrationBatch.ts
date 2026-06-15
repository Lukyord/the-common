import type { MigrationCliOptions } from '../../lib/cli.js'
import { getMigrationCutoffDate } from '../../lib/legacy.js'
import { createLegacySlugRegistry } from '../../lib/slugRegistry.js'
import { getEligibleEvents, mapLegacyEvent } from './mapLegacyEvent.js'
import { loadLegacyEvents, selectLegacyEventsByIndexes } from './loadLegacyEvents.js'
import type { MappedLegacyEvent } from './types.js'

export type MigrationEventBatch = {
  legacyTotal: number
  selectedIndexes: number[] | null
  mapped: MappedLegacyEvent[]
  eligible: MappedLegacyEvent[]
}

export type MigrationBatchOptions = {
  indexes?: MigrationCliOptions['indexes']
  limit?: MigrationCliOptions['limit']
}

export function resolveMigrationIndexes(options: MigrationBatchOptions): number[] {
  const { selectedIndexes, eligible } = getMigrationEventBatch(options)

  if (selectedIndexes) {
    const eligibleIndexes = new Set(
      eligible.map((event) => event.legacyIndex).filter((index): index is number => index != null),
    )
    return selectedIndexes.filter((index) => eligibleIndexes.has(index))
  }

  return eligible
    .map((event) => event.legacyIndex)
    .filter((index): index is number => index != null)
}

export function getMigrationEventBatch(
  options: MigrationBatchOptions = {},
  cutoff = getMigrationCutoffDate(),
): MigrationEventBatch {
  const legacyEvents = loadLegacyEvents()
  const indexedEvents = options.indexes
    ? selectLegacyEventsByIndexes(legacyEvents, options.indexes)
    : legacyEvents.map((event, legacyIndex) => ({ event, legacyIndex }))

  const slugRegistry = createLegacySlugRegistry()
  const mapped = indexedEvents.map(({ event, legacyIndex }) => ({
    ...mapLegacyEvent(event, slugRegistry, cutoff),
    legacyIndex,
  }))

  let eligible = getEligibleEvents(mapped)
  if (options.limit) {
    eligible = eligible.slice(0, options.limit)
  }

  return {
    legacyTotal: legacyEvents.length,
    selectedIndexes: options.indexes
      ? indexedEvents.map(({ legacyIndex }) => legacyIndex)
      : null,
    mapped,
    eligible,
  }
}
