import { NextResponse } from 'next/server'

import { BRANCH_VENDORS_PAGE_SIZE } from '@/components/branch/vendors/types'
import { getBranchBySlug, getBranchVendors } from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

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
  const branchSlug = searchParams.get('branch')?.trim()
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.max(1, Number(searchParams.get('limit') ?? BRANCH_VENDORS_PAGE_SIZE))
  const lifestyleIds = parseLifestyleIds(searchParams.get('lifestyles'))

  if (!branchSlug) {
    return NextResponse.json({ error: 'Branch is required' }, { status: 400 })
  }

  try {
    const branch = await getBranchBySlug(branchSlug)
    const result = await getBranchVendors(branch, page, limit, lifestyleIds)

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Branch not found' }, { status: 404 })
  }
}
