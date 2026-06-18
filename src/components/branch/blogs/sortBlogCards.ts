import type { GridCardSortOrder } from '@/components/branch/GridCardContainer/types'
import { parseScheduleDate } from '@/lib/whatsOnEventSchedule'

import type { BlogCardData } from './types'

function getBlogSortTime(card: BlogCardData) {
  const date = parseScheduleDate(card.publishedDate)
  if (date) return date.getTime()

  return card.id
}

export function sortBlogCards(cards: BlogCardData[], sortOrder: GridCardSortOrder) {
  return [...cards].sort((a, b) => {
    const aTime = getBlogSortTime(a)
    const bTime = getBlogSortTime(b)
    const timeDiff = sortOrder === 'oldest-newest' ? aTime - bTime : bTime - aTime

    if (timeDiff !== 0) return timeDiff

    return sortOrder === 'oldest-newest' ? a.id - b.id : b.id - a.id
  })
}
