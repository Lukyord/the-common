export const VENUE_RENTAL_CONTACT_SUBJECT = 'Venue Rental'
export const BECOME_OUR_TENANT_CONTACT_SUBJECT = 'Become our tenant'

export const FALLBACK_CONTACT_SUBJECTS = [
  'Lost & Found',
  VENUE_RENTAL_CONTACT_SUBJECT,
  BECOME_OUR_TENANT_CONTACT_SUBJECT,
  'Brand Collaborations & Sponsorships',
  'General Inquiry',
  'Event Sponsership',
] as const

export function resolveContactSubjects(subjects: string[]): string[] {
  const fromCms = subjects.map((item) => item.trim()).filter((item) => item.length > 0)
  return fromCms.length > 0 ? fromCms : [...FALLBACK_CONTACT_SUBJECTS]
}

export function mergeContactSubjects(sources: string[][]): string[] {
  const seen = new Set<string>()
  const merged: string[] = []

  for (const source of sources) {
    for (const subject of resolveContactSubjects(source)) {
      if (seen.has(subject)) continue
      seen.add(subject)
      merged.push(subject)
    }
  }

  return merged.length > 0 ? merged : [...FALLBACK_CONTACT_SUBJECTS]
}

export function isVenueRentalContactSubject(subject: string): boolean {
  return subject.trim().toLowerCase() === VENUE_RENTAL_CONTACT_SUBJECT.toLowerCase()
}

export function isBecomeOurTenantContactSubject(subject: string): boolean {
  return subject.trim().toLowerCase() === BECOME_OUR_TENANT_CONTACT_SUBJECT.toLowerCase()
}
