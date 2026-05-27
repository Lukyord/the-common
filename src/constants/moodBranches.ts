export const MOOD_CARD_BRANCH_SLUGS = ['thonglor', 'cloud-11', 'saladaeng'] as const

export type MoodCardBranchSlug = (typeof MOOD_CARD_BRANCH_SLUGS)[number]
