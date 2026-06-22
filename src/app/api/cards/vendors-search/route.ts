import { NextResponse } from 'next/server'

import { BRANCH_VENDORS_PAGE_SIZE } from '@/components/branch/vendors/types'
import { searchVendorsByText } from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim() ?? ''
  const branch = searchParams.get('branch')?.trim() ?? undefined
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.max(1, Number(searchParams.get('limit') ?? BRANCH_VENDORS_PAGE_SIZE))

  if (!query) {
    return NextResponse.json({ cards: [], hasMore: false })
  }

  const result = await searchVendorsByText(query, page, limit, branch)

  return NextResponse.json(result)
}
