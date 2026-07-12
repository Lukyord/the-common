export const MOOD_VENDOR_SLUGS = [
  'roots',
  'all-kinds',
  'monty-s',
] as const

export type MoodVendorSlug = (typeof MOOD_VENDOR_SLUGS)[number]
