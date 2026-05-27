export const MOOD_VENDOR_SLUGS = ['roots', 'all-kinds', 'montys-by-roast'] as const

export type MoodVendorSlug = (typeof MOOD_VENDOR_SLUGS)[number]
