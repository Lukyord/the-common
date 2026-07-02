import { MOOD_CARD_BRANCH_SLUGS, type MoodCardBranchSlug } from '@/constants/moodBranches'

export const VENUE_RENTAL_DEFAULT_AVAILABLE_TIME = 'Everyday 08:00 am – Midnight'

export const VENUE_RENTAL_AVAILABLE_TIME_BY_BRANCH_SLUG: Record<MoodCardBranchSlug, string> = {
  thonglor: 'Everyday 08:00 am – Midnight',
  saladaeng: 'Everyday 08:00 am – Midnight',
  'cloud-11': 'Everyday 08:00 am – 11.30pm',
}

export function getVenueRentalAvailableTime(branchSlug: string): string {
  if (MOOD_CARD_BRANCH_SLUGS.includes(branchSlug as MoodCardBranchSlug)) {
    return VENUE_RENTAL_AVAILABLE_TIME_BY_BRANCH_SLUG[branchSlug as MoodCardBranchSlug]
  }

  return VENUE_RENTAL_DEFAULT_AVAILABLE_TIME
}
