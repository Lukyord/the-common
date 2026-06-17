import { NextResponse } from 'next/server'

import {
  getGlobalVendorsForFilterPage,
  GRID_CARD_PAGE_SIZE,
  type GridCardPageFilters,
} from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

function getFilterParam(value: string | null) {
  const trimmed = value?.trim()
  if (!trimmed || trimmed === 'all') return undefined

  return trimmed
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.max(1, Number(searchParams.get('limit') ?? GRID_CARD_PAGE_SIZE))
  const filters: GridCardPageFilters = {
    category: getFilterParam(searchParams.get('category')),
    branch: getFilterParam(searchParams.get('branch')),
  }

  const result = await getGlobalVendorsForFilterPage(page, limit, filters)

  return NextResponse.json(result)
}
