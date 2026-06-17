import { NextResponse } from 'next/server'

import {
  getBranchBySlug,
  getBranchWhatsOnArchived,
  getGlobalWhatsOnArchived,
  GRID_CARD_PAGE_SIZE,
} from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const branchSlug = searchParams.get('branch')?.trim()
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.max(1, Number(searchParams.get('limit') ?? GRID_CARD_PAGE_SIZE))

  if (!branchSlug) {
    const result = await getGlobalWhatsOnArchived(page, limit)
    return NextResponse.json(result)
  }

  try {
    const branch = await getBranchBySlug(branchSlug)
    const result = await getBranchWhatsOnArchived(branch, page, limit)

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Branch not found' }, { status: 404 })
  }
}
