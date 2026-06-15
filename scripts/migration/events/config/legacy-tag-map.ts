export type LegacyCategory =
  | 'Community Events'
  | 'Free Events'
  | 'Family'
  | 'Cooking'
  | 'Arts & Crafts'
  | 'Health & Wellness'
  | 'Sustainable'
  | 'Market'

export type TagMapping = {
  mainTag: string | null
  subTag: string | null
}

export const LEGACY_CATEGORY_MAP: Record<LegacyCategory, TagMapping> = {
  'Community Events': { mainTag: 'Community Fun', subTag: null },
  'Free Events': { mainTag: null, subTag: null },
  Family: { mainTag: null, subTag: 'Kids & Family' },
  Cooking: { mainTag: 'Workshop', subTag: 'Food & Drinks' },
  'Arts & Crafts': { mainTag: 'Workshop', subTag: 'Art & Culture' },
  'Health & Wellness': { mainTag: null, subTag: 'Health & Well-being' },
  Sustainable: { mainTag: null, subTag: 'Sustainability' },
  Market: { mainTag: null, subTag: 'Market' },
}
