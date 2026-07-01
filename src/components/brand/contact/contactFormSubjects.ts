export const VENUE_RENTAL_CONTACT_SUBJECT = 'Venue Rental'

export const FALLBACK_CONTACT_SUBJECTS = [
  'Lost & Found',
  VENUE_RENTAL_CONTACT_SUBJECT,
  'Business Interest',
  'Brand Collaboration',
  'General Inquiry',
  'Event Sponsership',
] as const

export function resolveContactSubjects(subjects: string[]): string[] {
  const fromCms = subjects.map((item) => item.trim()).filter((item) => item.length > 0)
  return fromCms.length > 0 ? fromCms : [...FALLBACK_CONTACT_SUBJECTS]
}

export function isVenueRentalContactSubject(subject: string): boolean {
  return subject.trim().toLowerCase() === VENUE_RENTAL_CONTACT_SUBJECT.toLowerCase()
}
