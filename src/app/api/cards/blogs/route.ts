import { NextResponse } from 'next/server'

import { BLOGS_PAGE_SIZE } from '@/components/branch/blogs/types'
import { getBlogsPage } from '@/payload/queries/blogs'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.max(1, Number(searchParams.get('limit') ?? BLOGS_PAGE_SIZE))

  const result = await getBlogsPage(page, limit)

  return NextResponse.json(result)
}
