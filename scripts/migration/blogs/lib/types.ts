export type LegacyBlog = {
  _id: { $oid: string }
  title: string
  slug: string
  content?: string
  branch?: string
  images?: string[]
  date?: { $date: string }
  isDelete?: boolean
}

export type MappedLegacyBlog = {
  legacyIndex?: number
  legacyId: string
  legacySlug: string
  title: string
  slug: string
  fingerprint: string
  branchSlug: string | null
  publishedDate: string | null
  contentHtml: string | null
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
    discardedDeleted: number
    discardedNoTitle: number
    discardedByAge: number
    discardedNoDate: number
    withMediaPath: number
    withGallery: number
    duplicateSlugsResolved: number
    unknownBranch: number
  }
  warnings: string[]
  sampleEligible: MappedLegacyBlog[]
  sampleDiscarded: Array<{ title: string; reason: string; legacyIndex?: number }>
}
