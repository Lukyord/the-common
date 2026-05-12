import configPromise from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

export const getPayloadClient = cache(() =>
  getPayload({
    config: configPromise,
  }),
)
