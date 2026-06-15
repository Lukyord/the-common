import type { WhatsOn } from '@/payload-types'

import type { ParsedLegacyWhen } from './types.js'
import { toIsoDate } from '../../lib/legacy.js'

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

const WEEKDAYS: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  weds: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
}

type ParseOptions = {
  fallbackYear?: number
  archiveDate?: Date | null
}

function stripOrdinal(value: string): string {
  return value.replace(/(\d+)(st|nd|rd|th)/gi, '$1')
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function parseMonthToken(token: string): number | null {
  const key = token.toLowerCase().replace(/\./g, '')
  return MONTHS[key] ?? null
}

function parseWeekdayToken(token: string): number | null {
  const key = token.toLowerCase().replace(/\./g, '')
  return WEEKDAYS[key] ?? null
}

function parseYearToken(token: string | undefined, fallbackYear: number): number | null {
  if (!token) return fallbackYear

  const trimmed = token.trim()
  if (/^20\d{2}$/.test(trimmed)) return Number.parseInt(trimmed, 10)
  if (/^\d{2}$/.test(trimmed)) return 2000 + Number.parseInt(trimmed, 10)
  return fallbackYear
}

function buildDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null
  }
  date.setHours(0, 0, 0, 0)
  return date
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function normalizeWhenText(input: string): string {
  return normalizeWhitespace(
    stripOrdinal(input)
      .replace(/\bOctover\b/gi, 'October')
      .replace(/,(\S)/g, ', $1'),
  )
}

function expandCompoundDates(text: string): string {
  if (text.includes(' & ')) {
    const parts = text.split(/\s*&\s*/)
    if (parts.length > 1) {
      return `${parts[0].trim()} - ${parts[parts.length - 1].trim()}`
    }
  }

  const orParts = text.split(/\s+or\s+/i)
  if (orParts.length === 2) {
    const startMatch = orParts[0].trim().match(/^(?:[A-Za-z]+,\s+)?([A-Za-z]+)\s+(\d{1,2})$/i)
    const endMatch = orParts[1].trim().match(/^(?:[A-Za-z]+,\s+)?([A-Za-z]+)\s+(\d{1,2})$/i)
    if (
      startMatch &&
      endMatch &&
      startMatch[1].toLowerCase() === endMatch[1].toLowerCase()
    ) {
      return `${startMatch[1]} ${startMatch[2]} - ${endMatch[2]}`
    }
  }

  return text
}

function findMonthForWeekdayDayYear(weekday: number, day: number, year: number): number | null {
  const matches: number[] = []

  for (let month = 0; month < 12; month += 1) {
    const date = buildDate(year, month, day)
    if (date && date.getDay() === weekday) {
      matches.push(month)
    }
  }

  return matches.length ? matches[matches.length - 1]! : null
}

function extractTime(when: string): { datePart: string; time: string | null } {
  const trimmed = when.trim()

  if (trimmed.includes('//')) {
    const [datePart, ...rest] = trimmed.split('//')
    return {
      datePart: normalizeWhitespace(datePart.replace(/,\s*$/, '')),
      time: normalizeWhitespace(rest.join(' // ')) || null,
    }
  }

  const parenMatch = trimmed.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  if (parenMatch) {
    return {
      datePart: normalizeWhitespace(parenMatch[1]),
      time: normalizeWhitespace(parenMatch[2]) || null,
    }
  }

  const commaTimeMatch = trimmed.match(/^(.+?),\s*(\d[\d:.]*\s*(?:am|pm|AM|PM).*)$/i)
  if (commaTimeMatch) {
    return {
      datePart: normalizeWhitespace(commaTimeMatch[1]),
      time: normalizeWhitespace(commaTimeMatch[2]),
    }
  }

  return { datePart: trimmed, time: null }
}

function parseDayMonthYear(
  input: string,
  fallbackYear: number,
): { start: Date | null; end: Date | null } {
  const text = expandCompoundDates(normalizeWhenText(input))

  const fullRangeBothYears = text.match(
    /^([A-Za-z]+)\s+(\d{1,2}),\s*(20\d{2}|\d{2})\s*[-–—]\s*([A-Za-z]+)\s+(\d{1,2}),\s*(20\d{2}|\d{2})$/i,
  )
  if (fullRangeBothYears) {
    const startMonth = parseMonthToken(fullRangeBothYears[1])
    const endMonth = parseMonthToken(fullRangeBothYears[4])
    const startYear = parseYearToken(fullRangeBothYears[3], fallbackYear)
    const endYear = parseYearToken(fullRangeBothYears[6], fallbackYear)
    if (startMonth == null || endMonth == null || startYear == null || endYear == null) {
      return { start: null, end: null }
    }
    return {
      start: buildDate(startYear, startMonth, Number.parseInt(fullRangeBothYears[2], 10)),
      end: buildDate(endYear, endMonth, Number.parseInt(fullRangeBothYears[5], 10)),
    }
  }

  const crossMonthRangeWithYear = text.match(
    /^([A-Za-z]+)\s+(\d{1,2})\s*[-–—]\s*([A-Za-z]+)\s+(\d{1,2})\s*,\s*(20\d{2}|\d{2})$/i,
  )
  if (crossMonthRangeWithYear) {
    const startMonth = parseMonthToken(crossMonthRangeWithYear[1])
    const endMonth = parseMonthToken(crossMonthRangeWithYear[3])
    const year = parseYearToken(crossMonthRangeWithYear[5], fallbackYear)
    if (startMonth == null || endMonth == null || year == null) {
      return { start: null, end: null }
    }
    return {
      start: buildDate(year, startMonth, Number.parseInt(crossMonthRangeWithYear[2], 10)),
      end: buildDate(year, endMonth, Number.parseInt(crossMonthRangeWithYear[4], 10)),
    }
  }

  const monthOnlyRange = text.match(
    /^([A-Za-z]+)\s*[-–—]\s*([A-Za-z]+)\s*,\s*(20\d{2}|\d{2})$/i,
  )
  if (monthOnlyRange) {
    const startMonth = parseMonthToken(monthOnlyRange[1])
    const endMonth = parseMonthToken(monthOnlyRange[2])
    const year = parseYearToken(monthOnlyRange[3], fallbackYear)
    if (startMonth == null || endMonth == null || year == null) {
      return { start: null, end: null }
    }
    return {
      start: buildDate(year, startMonth, 1),
      end: buildDate(year, endMonth, lastDayOfMonth(year, endMonth)),
    }
  }

  const monthRangeWithYear = text.match(
    /^([A-Za-z]+)\s+(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*,\s*(20\d{2}|\d{2})$/i,
  )
  if (monthRangeWithYear) {
    const month = parseMonthToken(monthRangeWithYear[1])
    const year = parseYearToken(monthRangeWithYear[4], fallbackYear)
    if (month == null || year == null) return { start: null, end: null }
    return {
      start: buildDate(year, month, Number.parseInt(monthRangeWithYear[2], 10)),
      end: buildDate(year, month, Number.parseInt(monthRangeWithYear[3], 10)),
    }
  }

  const monthDayRangeYear = text.match(
    /^(?:[A-Za-z&\s]+,?\s+)?([A-Za-z]+)\s+(\d{1,2})\s*[-–—]\s*(\d{1,2})\s+(20\d{2}|\d{2})$/i,
  )
  if (monthDayRangeYear) {
    const month = parseMonthToken(monthDayRangeYear[1])
    const year = parseYearToken(monthDayRangeYear[4], fallbackYear)
    if (month == null || year == null) return { start: null, end: null }
    return {
      start: buildDate(year, month, Number.parseInt(monthDayRangeYear[2], 10)),
      end: buildDate(year, month, Number.parseInt(monthDayRangeYear[3], 10)),
    }
  }

  const monthDayRangeNoYear = text.match(/^([A-Za-z]+)\s+(\d{1,2})\s*[-–—]\s*(\d{1,2})$/i)
  if (monthDayRangeNoYear) {
    const month = parseMonthToken(monthDayRangeNoYear[1])
    const year = fallbackYear
    if (month != null) {
      return {
        start: buildDate(year, month, Number.parseInt(monthDayRangeNoYear[2], 10)),
        end: buildDate(year, month, Number.parseInt(monthDayRangeNoYear[3], 10)),
      }
    }
  }

  const weekdayDayYear = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(20\d{2}|\d{2})$/i)
  if (weekdayDayYear && parseWeekdayToken(weekdayDayYear[1]) != null) {
    const weekday = parseWeekdayToken(weekdayDayYear[1])!
    const year = parseYearToken(weekdayDayYear[3], fallbackYear)
    const day = Number.parseInt(weekdayDayYear[2], 10)
    if (year != null) {
      const month = findMonthForWeekdayDayYear(weekday, day, year)
      if (month != null) {
        const date = buildDate(year, month, day)
        if (date) return { start: date, end: date }
      }
    }
  }

  const weekdayMonthDayYear = text.match(
    /^(?:[A-Za-z]+,\s+)?([A-Za-z]+)\s+(\d{1,2}),?\s+(20\d{2}|\d{2})$/i,
  )
  if (weekdayMonthDayYear) {
    const month = parseMonthToken(weekdayMonthDayYear[1])
    const year = parseYearToken(weekdayMonthDayYear[3], fallbackYear)
    if (month != null && year != null) {
      const date = buildDate(year, month, Number.parseInt(weekdayMonthDayYear[2], 10))
      if (date) return { start: date, end: date }
    }
  }

  const weekdayMonthDayNoYear = text.match(/^(?:[A-Za-z]+,\s+)?([A-Za-z]+)\s+(\d{1,2})$/i)
  if (weekdayMonthDayNoYear) {
    const month = parseMonthToken(weekdayMonthDayNoYear[1])
    if (month != null) {
      const date = buildDate(
        fallbackYear,
        month,
        Number.parseInt(weekdayMonthDayNoYear[2], 10),
      )
      if (date) return { start: date, end: date }
    }
  }

  const dayMonthCommaYear = text.match(/^(\d{1,2})\s+([A-Za-z]+)\s*,\s*(20\d{2}|\d{2})$/i)
  if (dayMonthCommaYear) {
    const month = parseMonthToken(dayMonthCommaYear[2])
    const year = parseYearToken(dayMonthCommaYear[3], fallbackYear)
    if (month != null && year != null) {
      const date = buildDate(year, month, Number.parseInt(dayMonthCommaYear[1], 10))
      if (date) return { start: date, end: date }
    }
  }

  const dayRangeSameMonth = text.match(
    /^([A-Za-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?\s*[-–—]\s*([A-Za-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)(?:\s+(20\d{2}|\d{2}))?$/i,
  )
  if (dayRangeSameMonth) {
    const month = parseMonthToken(dayRangeSameMonth[5])
    const year = parseYearToken(dayRangeSameMonth[6], fallbackYear)
    if (month == null || year == null) return { start: null, end: null }
    return {
      start: buildDate(year, month, Number.parseInt(dayRangeSameMonth[2], 10)),
      end: buildDate(year, month, Number.parseInt(dayRangeSameMonth[4], 10)),
    }
  }

  const weekdayDate = text.match(
    /^(?:[A-Za-z]+,?\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)(?:\s+(20\d{2}|\d{2}))?$/i,
  )
  if (weekdayDate) {
    const month = parseMonthToken(weekdayDate[2])
    const year = parseYearToken(weekdayDate[3], fallbackYear)
    if (month == null || year == null) return { start: null, end: null }
    const date = buildDate(year, month, Number.parseInt(weekdayDate[1], 10))
    return { start: date, end: date }
  }

  const dayMonthYear = text.match(/^(\d{1,2})\s+([A-Za-z]+)(?:\s+(20\d{2}|\d{2}))?$/i)
  if (dayMonthYear) {
    const month = parseMonthToken(dayMonthYear[2])
    const year = parseYearToken(dayMonthYear[3], fallbackYear)
    if (month == null || year == null) return { start: null, end: null }
    const date = buildDate(year, month, Number.parseInt(dayMonthYear[1], 10))
    return { start: date, end: date }
  }

  const monthDayYear = text.match(/^([A-Za-z]+)\s+(\d{1,2})(?:,?\s+(20\d{2}|\d{2}))?$/i)
  if (monthDayYear) {
    const month = parseMonthToken(monthDayYear[1])
    const year = parseYearToken(monthDayYear[3], fallbackYear)
    if (month == null || year == null) return { start: null, end: null }
    const date = buildDate(year, month, Number.parseInt(monthDayYear[2], 10))
    return { start: date, end: date }
  }

  return { start: null, end: null }
}

function toEventSchedule(start: Date, end: Date): WhatsOn['eventSchedule'] {
  const startIso = toIsoDate(start)
  const endIso = toIsoDate(end)

  if (startIso === endIso) {
    return { pattern: 'single', date: startIso }
  }

  return {
    pattern: 'range',
    startDate: startIso,
    endDate: endIso,
  }
}

export function parseLegacyWhen(
  when: string | undefined,
  options: ParseOptions = {},
): ParsedLegacyWhen {
  const warnings: string[] = []

  if (!when?.trim()) {
    return {
      time: null,
      eventSchedule: null,
      startDate: null,
      endDate: null,
      warnings: ['Missing when value'],
    }
  }

  const fallbackYear =
    options.archiveDate?.getFullYear() ??
    options.fallbackYear ??
    new Date().getFullYear()

  const { datePart, time } = extractTime(when)
  const { start, end } = parseDayMonthYear(datePart, fallbackYear)

  if (!start || !end) {
    return {
      time,
      eventSchedule: null,
      startDate: null,
      endDate: null,
      warnings: [`Unable to parse date part: ${datePart}`],
    }
  }

  if (!/\b20\d{2}\b/.test(datePart) && !/\b\d{2}\b/.test(datePart.split(/\s+/).pop() ?? '')) {
    warnings.push(`Inferred year ${start.getFullYear()} for: ${when}`)
  }

  return {
    time,
    eventSchedule: toEventSchedule(start, end),
    startDate: start,
    endDate: end,
    warnings,
  }
}
