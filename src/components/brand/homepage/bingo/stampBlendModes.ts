import type { CSSProperties } from 'react'

export type StampBlendMode = NonNullable<CSSProperties['mixBlendMode']>
export type StampOpacity = NonNullable<CSSProperties['opacity']>

export type StampBlendModeConfig = {
  mixBlendMode: StampBlendMode
  opacity?: StampOpacity
}

/** Per-stamp image blend (index 0 = bingo-1.webp … index 8 = bingo-9.webp). */
export const BINGO_STAMP_BLEND_MODES: StampBlendModeConfig[] = [
  { mixBlendMode: 'soft-light' },
  { mixBlendMode: 'multiply', opacity: 0.9 },
  { mixBlendMode: 'hard-light' },
  { mixBlendMode: 'multiply', opacity: 0.7 },
  { mixBlendMode: 'hard-light' },
  { mixBlendMode: 'multiply' },
  { mixBlendMode: 'darken' },
  { mixBlendMode: 'multiply' },
  { mixBlendMode: 'hue' },
]

const DEFAULT_STAMP_BLEND_CONFIG: StampBlendModeConfig = { mixBlendMode: 'multiply' }

export function getStampBlendConfig(stampIndex: number): StampBlendModeConfig {
  return BINGO_STAMP_BLEND_MODES[stampIndex] ?? DEFAULT_STAMP_BLEND_CONFIG
}
