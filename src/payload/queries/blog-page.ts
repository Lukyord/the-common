import { cache } from 'react'

import type { BlogPage } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

export type BlogPagePayloadData = {
  blogPage: BlogPage | null
  error?: string
}

export const getBlogPagePayloadData = cache(async (): Promise<BlogPagePayloadData> => {
  const payload = await getPayloadClient()

  const { data, errors } = await resolvePayloadQueries({
    blogPage: {
      errorMessage: 'Failed to load blog page global from Payload:',
      promise: payload.findGlobal({
        slug: 'blog-page',
        depth: 1,
        overrideAccess: false,
      }),
    },
  })

  return {
    blogPage: data.blogPage,
    error: errors.blogPage,
  }
})
