import { cache } from 'react'

import type { PrivacyPolicy } from '@/payload-types'
import { getPayloadClient } from '@/payload/getPayloadClient'
import { resolvePayloadQueries } from '@/payload/queries/functions/resolvePayloadQueries'

export type PrivacyPolicyPayloadData = {
  privacyPolicy: PrivacyPolicy | null
  error?: string
}

export const getPrivacyPolicyPayloadData = cache(async (): Promise<PrivacyPolicyPayloadData> => {
  const payload = await getPayloadClient()

  const { data, errors } = await resolvePayloadQueries({
    privacyPolicy: {
      errorMessage: 'Failed to load privacy policy global from Payload:',
      promise: payload.findGlobal({
        slug: 'privacy-policy',
        depth: 1,
        overrideAccess: false,
      }),
    },
  })

  return {
    privacyPolicy: data.privacyPolicy,
    error: errors.privacyPolicy,
  }
})
