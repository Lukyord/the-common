import type { BranchLandingWhatsOnCard } from '@/payload/queries/branch'

import {
  eventScheduleOverlapsRange,
  expandEventScheduleToDates,
  type WhatsOnEventSchedule,
} from '@/lib/whatsOnEventSchedule'

export const WHATS_ON_CALENDAR_PAGE_SIZE = 3
export const WHATS_ON_CALENDAR_MONTH_COUNT = 6

const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
] as const

export type CalendarMonthDefinition = {
  id: string
  title: string
  year: number
  month: number
}

export function buildNextCalendarMonths(
  count = WHATS_ON_CALENDAR_MONTH_COUNT,
  from = new Date(),
): CalendarMonthDefinition[] {
  const months: CalendarMonthDefinition[] = []
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1)

  for (let index = 0; index < count; index += 1) {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()

    months.push({
      id: `${year}-${String(month + 1).padStart(2, '0')}`,
      title: `${MONTH_NAMES[month]} ${year}`,
      year,
      month,
    })

    cursor.setMonth(cursor.getMonth() + 1)
  }

  return months
}

export function getMonthDateRange(year: number, month: number) {
  const start = new Date(year, month, 1)
  start.setHours(0, 0, 0, 0)

  const end = new Date(year, month + 1, 0)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export function cardOverlapsMonth(
  card: Pick<BranchLandingWhatsOnCard, 'eventSchedule'>,
  year: number,
  month: number,
) {
  return eventScheduleOverlapsRange(card.eventSchedule, getMonthDateRange(year, month))
}

function getEarliestDateInMonth(
  schedule: WhatsOnEventSchedule | null | undefined,
  year: number,
  month: number,
) {
  const { start, end } = getMonthDateRange(year, month)

  const dates = expandEventScheduleToDates(schedule).filter(
    (date) => date.getTime() >= start.getTime() && date.getTime() <= end.getTime(),
  )

  return dates[0]?.getTime() ?? Number.POSITIVE_INFINITY
}

export function sortCardsByEarliestDateInMonth(
  cards: BranchLandingWhatsOnCard[],
  year: number,
  month: number,
) {
  return [...cards].sort((a, b) => {
    const aTime = getEarliestDateInMonth(a.eventSchedule, year, month)
    const bTime = getEarliestDateInMonth(b.eventSchedule, year, month)
    return aTime - bTime
  })
}

export function paginateCalendarCards<T>(cards: T[], page: number, limit: number) {
  const start = (page - 1) * limit
  const slice = cards.slice(start, start + limit)

  return {
    cards: slice,
    hasMore: start + limit < cards.length,
  }
}
