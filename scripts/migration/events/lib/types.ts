import type { WhatsOn } from '@/payload-types'

export type LegacyEvent = {
  _id: { $oid: string }
  name: string
  slug: string
  when?: string
  where?: string
  detail?: string
  branch?: string
  categories?: string[]
  category?: string
  shortDescription?: string
  phone?: string
  coverImagePath?: string
  imagePath?: string
  images?: string[]
  isPass?: boolean
  updatedPastAt?: { $date: string }
}

export type ParsedLegacyWhen = {
  time: string | null
  eventSchedule: WhatsOn['eventSchedule'] | null
  startDate: Date | null
  endDate: Date | null
  warnings: string[]
}

export type MappedLegacyTags = {
  legacyTags: string[]
  mainTag: string | null
  subTags: string[]
  droppedSubTags: string[]
  unmappedTags: string[]
}

export type MappedLegacyEvent = {
  legacyIndex?: number
  legacyId: string
  legacySlug: string
  title: string
  slug: string
  fingerprint: string
  branchSlug: string
  eventSchedule: WhatsOn['eventSchedule'] | null
  time: string | null
  dateToBeArchived: string | null
  mainTag: string | null
  subTags: string[]
  contentHtml: string | null
  metaDescription: string | null
  mediaPath: string | null
  galleryPaths: string[]
  galleryReuseMedia: boolean
  warnings: string[]
  skippedReason: string | null
}

export type MigrationAnalysis = {
  generatedAt: string
  cutoffDate: string
  totals: {
    legacy: number
    selected?: number
    eligible: number
    discardedByAge: number
    discardedNoDate: number
    discardedNoBranch: number
    withMediaPath: number
    withGallery: number
    duplicateSlugsResolved: number
    dateParseFailed: number
  }
  tagStats: Record<string, number>
  warnings: string[]
  sampleEligible: MappedLegacyEvent[]
  sampleDiscarded: Array<{ name: string; reason: string; when?: string }>
}
