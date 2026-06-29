import type { WhatsOnSingleData } from '@/payload/queries/branch'

export type WhatsOnSingleProps = {
  event: WhatsOnSingleData
  backHref: string
  getTagHref: (tag: string) => string
  branchFooterBgColor: string
}
