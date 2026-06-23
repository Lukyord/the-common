export const FALLBACK_CONTACT_SUBJECTS = [
  'Lost & Found',
  'Venue Rental',
  'Business Interest',
  'Brand Collaboration',
  'General Inquiry',
  'Event Sponsership',
] as const

export function resolveContactSubjects(subjects: string[]): string[] {
  const fromCms = subjects.map((item) => item.trim()).filter((item) => item.length > 0)
  return fromCms.length > 0 ? fromCms : [...FALLBACK_CONTACT_SUBJECTS]
}
