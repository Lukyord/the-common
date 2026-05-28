import type { Homepage } from '@/payload-types'

export type HomepageAboutProps = {
  data?: Homepage['about']
}

export type StickyNote = NonNullable<NonNullable<Homepage['about']>['stickyNotes']>[number]

export type HomepageStickyNotesProps = {
  notes: StickyNote[]
}
