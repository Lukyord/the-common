import type { WhatsOn } from '@/payload-types'

export type WhatsOnEventSchedule = NonNullable<WhatsOn['eventSchedule']>
export type WhatsOnEventSchedulePattern = WhatsOnEventSchedule['pattern']

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export function parseScheduleDate(value?: string | null): Date | null {
  if (!value?.trim()) return null

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null

  const date = new Date(parsed)
  date.setHours(0, 0, 0, 0)
  return date
}

function twoDigitYear(year: number) {
  return String(year).slice(-2)
}

function formatDayDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()}`
}

export function formatSingleEventDate(date: Date) {
  return `${formatDayDate(date)} ${MONTHS[date.getMonth()]} ${twoDigitYear(date.getFullYear())}`
}

export function formatRangeEventDates(start: Date, end: Date) {
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  const sameYear = start.getFullYear() === end.getFullYear()

  if (sameMonth) {
    return `${WEEKDAYS[start.getDay()]} ${start.getDate()} – ${WEEKDAYS[end.getDay()]} ${end.getDate()} ${MONTHS[start.getMonth()]} ${twoDigitYear(start.getFullYear())}`
  }

  if (sameYear) {
    return `${WEEKDAYS[start.getDay()]} ${start.getDate()} ${MONTHS[start.getMonth()]} – ${WEEKDAYS[end.getDay()]} ${end.getDate()} ${MONTHS[end.getMonth()]} ${twoDigitYear(start.getFullYear())}`
  }

  return `${WEEKDAYS[start.getDay()]} ${start.getDate()} ${MONTHS[start.getMonth()]} ${twoDigitYear(start.getFullYear())} – ${WEEKDAYS[end.getDay()]} ${end.getDate()} ${MONTHS[end.getMonth()]} ${twoDigitYear(end.getFullYear())}`
}

export function expandDateRange(start: Date, end: Date): Date[] {
  const rangeStart = start.getTime() <= end.getTime() ? start : end
  const rangeEnd = start.getTime() <= end.getTime() ? end : start
  const dates: Date[] = []
  const cursor = new Date(rangeStart)

  while (cursor.getTime() <= rangeEnd.getTime()) {
    dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

export function formatMultipleRangeEventDates(ranges: { start: Date; end: Date }[]) {
  const sorted = [...ranges].sort((a, b) => a.start.getTime() - b.start.getTime())
  return sorted.map((range) => formatRangeEventDates(range.start, range.end)).join(', ')
}

export function formatMultipleEventDates(dates: Date[]) {
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime())
  const sameMonth = sorted.every(
    (date) =>
      date.getMonth() === sorted[0].getMonth() && date.getFullYear() === sorted[0].getFullYear(),
  )

  if (sameMonth && sorted.length > 0) {
    const last = sorted[sorted.length - 1]
    const dayParts = sorted.map((date) => formatDayDate(date)).join(', ')
    return `${dayParts} ${MONTHS[last.getMonth()]} ${twoDigitYear(last.getFullYear())}`
  }

  return sorted.map((date) => formatSingleEventDate(date)).join(', ')
}

export function expandEventScheduleToDates(schedule?: WhatsOnEventSchedule | null): Date[] {
  if (!schedule?.pattern) return []

  if (schedule.pattern === 'single') {
    const date = parseScheduleDate(schedule.date)
    return date ? [date] : []
  }

  if (schedule.pattern === 'range') {
    const start = parseScheduleDate(schedule.startDate)
    const end = parseScheduleDate(schedule.endDate)
    if (!start || !end) return []
    return expandDateRange(start, end)
  }

  if (schedule.pattern === 'multiple-range') {
    const dates = (schedule.ranges ?? []).flatMap((entry) => {
      const start = parseScheduleDate(entry?.startDate)
      const end = parseScheduleDate(entry?.endDate)
      if (!start || !end) return []
      return expandDateRange(start, end)
    })

    const unique = new Map<number, Date>()
    for (const date of dates) {
      unique.set(date.getTime(), date)
    }

    return [...unique.values()].sort((a, b) => a.getTime() - b.getTime())
  }

  if (schedule.pattern === 'multiple') {
    return (schedule.dates ?? [])
      .map((entry) => parseScheduleDate(entry?.date))
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => a.getTime() - b.getTime())
  }

  return []
}

export function formatWhatsOnEventSchedule(schedule?: WhatsOnEventSchedule | null): string | null {
  if (!schedule?.pattern) return null

  if (schedule.pattern === 'single') {
    const date = parseScheduleDate(schedule.date)
    return date ? formatSingleEventDate(date) : null
  }

  if (schedule.pattern === 'range') {
    const start = parseScheduleDate(schedule.startDate)
    const end = parseScheduleDate(schedule.endDate)
    if (!start || !end) return null
    return formatRangeEventDates(start, end)
  }

  if (schedule.pattern === 'multiple') {
    const dates = expandEventScheduleToDates(schedule)
    return dates.length ? formatMultipleEventDates(dates) : null
  }

  if (schedule.pattern === 'multiple-range') {
    const ranges = (schedule.ranges ?? [])
      .map((entry) => {
        const start = parseScheduleDate(entry?.startDate)
        const end = parseScheduleDate(entry?.endDate)
        if (!start || !end) return null
        return { start, end }
      })
      .filter((range): range is { start: Date; end: Date } => Boolean(range))

    return ranges.length ? formatMultipleRangeEventDates(ranges) : null
  }

  return null
}

export function getEarliestEventScheduleDate(schedule?: WhatsOnEventSchedule | null): Date | null {
  const dates = expandEventScheduleToDates(schedule)
  return dates[0] ?? null
}

export function eventScheduleOverlapsRange(
  schedule: WhatsOnEventSchedule | null | undefined,
  range: { start: Date; end: Date },
): boolean {
  const dates = expandEventScheduleToDates(schedule)
  if (!dates.length) return false

  const rangeStart = range.start.getTime()
  const rangeEnd = range.end.getTime()

  return dates.some((date) => {
    const value = date.getTime()
    return value >= rangeStart && value <= rangeEnd
  })
}
