import type { CollectionBeforeChangeHook } from 'payload'

import { formatWhatsOnEventSchedule } from '@/lib/whatsOnEventSchedule'
import type { WhatsOn } from '@/payload-types'

export const syncWhatsOnDateFromSchedule: CollectionBeforeChangeHook<WhatsOn> = ({
  data,
}) => {
  const formatted = formatWhatsOnEventSchedule(data.eventSchedule)
  if (formatted) {
    data.date = formatted
  }

  return data
}
