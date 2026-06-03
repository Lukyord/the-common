import type { BranchWhatsOnPage } from '@/payload-types'

export type WhatsOnLandingCardData = NonNullable<
  NonNullable<BranchWhatsOnPage['landing']>['cards']
>[number]

export type CardLayout = {
  x: number
  y: number
  rotation: number
}

export type CardState = {
  layout: CardLayout
  hasCustomLayout: boolean
  isFlipped: boolean
}
