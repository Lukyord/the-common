import { NextResponse } from 'next/server'

import { WHATS_ON_CALENDAR_PAGE_SIZE } from '@/lib/whatsOnCalendar'
import { getGlobalWhatsOnCalendarMonth } from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

function parseMainTagIds(value: string | null) {
  if (!value?.trim()) return []

  return value
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isFinite(id) && id > 0)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mainTagIds = parseMainTagIds(searchParams.get('mainTags'))
  const year = Number(searchParams.get('year'))
  const month = Number(searchParams.get('month'))
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.max(1, Number(searchParams.get('limit') ?? WHATS_ON_CALENDAR_PAGE_SIZE))

  if (!mainTagIds.length) {
    return NextResponse.json({ error: 'Main tags are required' }, { status: 400 })
  }

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 0 || month > 11) {
    return NextResponse.json({ error: 'Valid year and month are required' }, { status: 400 })
  }

  const result = await getGlobalWhatsOnCalendarMonth(mainTagIds, year, month, page, limit)

  return NextResponse.json(result)
}
