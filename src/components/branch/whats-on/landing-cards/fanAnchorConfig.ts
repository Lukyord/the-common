import { isMobileViewport } from '@/utils/utils'

export type FanAnchor = {
  xPercent: number
  yPercent: number
}

/** Spread origin (% of playfield): bottom-left of the last card. Breakpoint: <= 991px = mobile. */
export const WHATS_ON_FAN_ANCHOR = {
  pc: { xPercent: 50, yPercent: 110 },
  mb: { xPercent: 10, yPercent: 75 },
} as const satisfies Record<'pc' | 'mb', FanAnchor>

export function getWhatsOnFanAnchor(): FanAnchor {
  if (typeof window === 'undefined') return WHATS_ON_FAN_ANCHOR.pc
  return isMobileViewport() ? WHATS_ON_FAN_ANCHOR.mb : WHATS_ON_FAN_ANCHOR.pc
}
