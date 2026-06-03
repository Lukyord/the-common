export type WhatsOnTag = {
  id: string
  text: string
}

export const WHATS_ON_MAIN_TAGS = [
  { id: 'signature-event', text: 'Signature Event' },
  { id: 'thewholesome-club', text: 'theWHOLESOME Club' },
  { id: 'community-fun', text: 'Community Fun' },
  { id: 'workshop', text: 'Workshop' },
] as const satisfies readonly WhatsOnTag[]

export const WHATS_ON_SUB_TAGS = [
  { id: 'music', text: 'Music' },
  { id: 'kids-family', text: 'Kids & Family' },
  { id: 'food-drinks', text: 'Food & Drinks' },
  { id: 'market', text: 'Market' },
  { id: 'art-culture', text: 'Art & Culture' },
  { id: 'health-well-being', text: 'Health & Well-being' },
  { id: 'pet', text: 'Pet' },
  { id: 'lifestyle', text: 'Lifestyle' },
  { id: 'social-impact', text: 'Social Impact' },
  { id: 'sustainability', text: 'Sustainability' },
] as const satisfies readonly WhatsOnTag[]

export const whatsOnMainTagSelectOptions = WHATS_ON_MAIN_TAGS.map(({ id, text }) => ({
  label: text,
  value: id,
}))

export const whatsOnSubTagSelectOptions = WHATS_ON_SUB_TAGS.map(({ id, text }) => ({
  label: text,
  value: id,
}))
