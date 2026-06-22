import { NextResponse } from 'next/server'

import {
  getAllBranchVendorsForPage,
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

function parseLifestyleIds(value: string | null) {
  if (!value?.trim()) return undefined

  const ids = value
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isFinite(id) && id > 0)

  return ids.length ? ids : undefined
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.max(1, Number(searchParams.get('limit') ?? GRID_CARD_PAGE_SIZE))
  const lifestyleIds = parseLifestyleIds(searchParams.get('lifestyles'))
  const filters: GridCardPageFilters = {
    category: getFilterParam(searchParams.get('category')),
    branch: getFilterParam(searchParams.get('branch')),
  }

  const hasCategoryOrBranchFilter = Boolean(filters.category || filters.branch)

  if (!hasCategoryOrBranchFilter) {
    const result = await getAllBranchVendorsForPage(
      page,
      limit,
      lifestyleIds,
    )

    return NextResponse.json(result)
  }

  const result = await getGlobalVendorsForFilterPage(page, limit, filters)

  return NextResponse.json(result)
}
