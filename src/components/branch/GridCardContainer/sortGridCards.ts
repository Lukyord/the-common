import type {
  BranchLandingVendorCard,
  BranchLandingWhatsOnCard,
} from '@/payload/queries/branch'
import { getEarliestEventScheduleDate } from '@/lib/whatsOnEventSchedule'

import type { GridCardSortOrder, GridCardVariant } from './types'

function getWhatsOnSortTime(card: BranchLandingWhatsOnCard) {
  const eventDate = getEarliestEventScheduleDate(card.eventSchedule)
  if (eventDate) return eventDate.getTime()

  if (card.dateToBeArchived) {
    const time = new Date(card.dateToBeArchived).getTime()
    if (!Number.isNaN(time)) return time
  }

  return card.id
}

function getCardSortTime(
  card: BranchLandingWhatsOnCard | BranchLandingVendorCard,
  variant: GridCardVariant,
) {
  if (variant === 'whats-on') {
    return getWhatsOnSortTime(card as BranchLandingWhatsOnCard)
  }

  return card.id
}

export function sortGridCards(
  cards: (BranchLandingWhatsOnCard | BranchLandingVendorCard)[],
  variant: GridCardVariant,
  sortOrder: GridCardSortOrder,
) {
  return [...cards].sort((a, b) => {
    const aTime = getCardSortTime(a, variant)
    const bTime = getCardSortTime(b, variant)
    const timeDiff = sortOrder === 'oldest-newest' ? aTime - bTime : bTime - aTime

    if (timeDiff !== 0) return timeDiff

    return sortOrder === 'oldest-newest' ? a.id - b.id : b.id - a.id
  })
}

export const GRID_CARD_SORT_OPTIONS = [
  { value: 'newest-oldest', label: 'Newest-Oldest' },
  { value: 'oldest-newest', label: 'Oldest-Newest' },
] as const
