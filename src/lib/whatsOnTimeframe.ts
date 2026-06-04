import { eventScheduleOverlapsRange } from '@/lib/whatsOnEventSchedule'
import type { WhatsOn } from '@/payload-types'

export type WhatsOnTimeframeId = 'this-week' | 'this-month' | `month-${number}-${number}`

export type WhatsOnTimeframeOption = {
  id: WhatsOnTimeframeId
  label: string
  displayLabel: string
  range: { start: Date; end: Date }
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTH_NAMES_SHORT = [
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
]

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

export function startOfWeek(date: Date) {
  const start = startOfDay(date)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)
  return start
}

export function endOfWeek(date: Date) {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return endOfDay(end)
}

export function startOfMonth(date: Date) {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
}

export function endOfMonth(date: Date) {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

export function formatMonthYear(date: Date, uppercase = true) {
  const label = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
  return uppercase ? label.toUpperCase() : label
}

export function formatWeekRange(date: Date) {
  const start = startOfWeek(date)
  const end = endOfWeek(date)
  const sameMonth = start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${MONTH_NAMES_SHORT[end.getMonth()].toUpperCase()}`
  }

  return `${start.getDate()} ${MONTH_NAMES_SHORT[start.getMonth()].toUpperCase()} – ${end.getDate()} ${MONTH_NAMES_SHORT[end.getMonth()].toUpperCase()}`
}

export function buildWhatsOnTimeframeOptions(now = new Date()): WhatsOnTimeframeOption[] {
  const options: WhatsOnTimeframeOption[] = [
    {
      id: 'this-week',
      label: 'This week',
      displayLabel: formatWeekRange(now),
      range: { start: startOfWeek(now), end: endOfWeek(now) },
    },
    {
      id: 'this-month',
      label: MONTH_NAMES[now.getMonth()],
      displayLabel: formatMonthYear(now),
      range: { start: startOfMonth(now), end: endOfMonth(now) },
    },
  ]

  for (let i = 1; i <= 5; i += 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
    options.push({
      id: `month-${monthDate.getFullYear()}-${monthDate.getMonth()}`,
      label: MONTH_NAMES[monthDate.getMonth()],
      displayLabel: formatMonthYear(monthDate),
      range: { start: startOfMonth(monthDate), end: endOfMonth(monthDate) },
    })
  }

  return options
}

export function getWhatsOnTimeframeOption(
  id: WhatsOnTimeframeId,
  now = new Date(),
): WhatsOnTimeframeOption | undefined {
  return buildWhatsOnTimeframeOptions(now).find((option) => option.id === id)
}

export function filterByTimeframe<T extends { eventSchedule?: WhatsOn['eventSchedule'] | null }>(
  items: T[],
  timeframeId: WhatsOnTimeframeId,
  now = new Date(),
): T[] {
  const option = getWhatsOnTimeframeOption(timeframeId, now)
  if (!option) return []

  return items.filter((item) => eventScheduleOverlapsRange(item.eventSchedule, option.range))
}
