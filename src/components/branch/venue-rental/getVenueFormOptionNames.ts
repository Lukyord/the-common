import type { VenueRentalBranchVenuePage } from '@/payload/queries/venue-rental-page'

export function getVenueFormOptionNames(page?: VenueRentalBranchVenuePage | null): string[] {
  if (!page?.venues?.length) return []

  return page.venues
    .filter((venue) => venue.show !== false)
    .map((venue) => venue.formOptionName?.trim())
    .filter((name): name is string => Boolean(name))
}
