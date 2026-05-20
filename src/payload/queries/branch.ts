import { cache } from 'react'
import { notFound } from 'next/navigation'

import type { Branch } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'

export const getBranchBySlug = cache(async (slug: string): Promise<Branch> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'branches',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const branch = docs[0]
  if (!branch) notFound()

  return branch
})
