export const MOOD_VENDOR_SLUGS = [
  'roots-thonglor',
  'all-kinds-thonglor',
  'monty-s-thonglor',
] as const

export type MoodVendorSlug = (typeof MOOD_VENDOR_SLUGS)[number]
