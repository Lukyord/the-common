import { cache } from 'react'

import type { Contact, Homepage, Lifestyle } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

type HomeLifestyle = Pick<Lifestyle, 'id' | 'text'>

type PayloadDataErrors = Partial<Record<'contact' | 'homepage' | 'lifestyle', string>>

export type HomePayloadData = {
  contact: Contact | null
  errors: PayloadDataErrors
  homepage: Homepage | null
  lifestyles: HomeLifestyle[]
}

const LIFESTYLE_LIMIT = 10

export const getHomePayloadData = cache(async (): Promise<HomePayloadData> => {
  const payload = await getPayloadClient()

  const { data, errors } = await resolvePayloadQueries({
    contact: {
      errorMessage: 'Failed to load contact global from Payload:',
      promise: payload.findGlobal({
        slug: 'contact',
        depth: 0,
        overrideAccess: false,
      }),
    },
    homepage: {
      errorMessage: 'Failed to load homepage global from Payload:',
      promise: payload.findGlobal({
        slug: 'homepage',
        depth: 1,
        overrideAccess: false,
      }),
    },
    lifestyle: {
      errorMessage: 'Failed to load lifestyle collection from Payload:',
      promise: payload.find({
        collection: 'lifestyle',
        depth: 0,
        limit: LIFESTYLE_LIMIT,
        overrideAccess: false,
        pagination: false,
        sort: '-createdAt',
        select: {
          text: true,
        },
      }),
    },
  })

  const lifestyles =
    data.lifestyle?.docs.map(({ id, text }) => ({
      id,
      text,
    })) ?? []

  return {
    contact: data.contact,
    errors,
    homepage: data.homepage,
    lifestyles,
  }
})
