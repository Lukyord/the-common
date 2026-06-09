import { cache } from 'react'

import {
  mapMoodVendorCards,
  mapMoodVendorPool,
} from '@/components/brand/homepage/mood/mapMoodVendorCard'
import type { Contact, Homepage, Lifestyle } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'
import type {
  MoodVendorCard,
  MoodVendorPoolItem,
} from '@/components/brand/homepage/mood/mapMoodVendorCard'

export type HomeLifestyle = Pick<Lifestyle, 'id' | 'text'>

type PayloadDataErrors = Partial<Record<'contact' | 'homepage' | 'lifestyle' | 'vendors', string>>

export type HomePayloadData = {
  contact: Contact | null
  errors: PayloadDataErrors
  homepage: Homepage | null
  lifestyles: HomeLifestyle[]
  defaultMoodVendors: MoodVendorCard[]
  moodVendorPool: MoodVendorPoolItem[]
}

const LIFESTYLE_LIMIT = 10

export type HomepageMottoData = {
  motto: Homepage['motto']
}

export const getHomepageMottoData = cache(async (): Promise<HomepageMottoData> => {
  const payload = await getPayloadClient()
  const homepage = await payload.findGlobal({
    slug: 'homepage',
    depth: 0,
    overrideAccess: false,
    select: {
      motto: true,
    },
  })

  return {
    motto: homepage?.motto ?? null,
  }
})

export type HomepageMembershipData = {
  membership: Homepage['membership']
}

export const getHomepageMembershipData = cache(async (): Promise<HomepageMembershipData> => {
  const payload = await getPayloadClient()
  const homepage = await payload.findGlobal({
    slug: 'homepage',
    depth: 1,
    overrideAccess: false,
    select: {
      membership: true,
    },
  })

  return {
    membership: homepage?.membership ?? null,
  }
})

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
    vendors: {
      errorMessage: 'Failed to load vendors from Payload:',
      promise: payload.find({
        collection: 'vendors',
        depth: 2,
        limit: 500,
        overrideAccess: false,
        pagination: false,
      }),
    },
  })

  const lifestyles =
    data.lifestyle?.docs.map(({ id, text }) => ({
      id,
      text,
    })) ?? []

  const vendorDocs = data.vendors?.docs ?? []
  const defaultMoodVendors = mapMoodVendorCards(vendorDocs)
  const moodVendorPool = mapMoodVendorPool(vendorDocs)

  return {
    contact: data.contact,
    errors,
    homepage: data.homepage,
    lifestyles,
    defaultMoodVendors,
    moodVendorPool,
  }
})
