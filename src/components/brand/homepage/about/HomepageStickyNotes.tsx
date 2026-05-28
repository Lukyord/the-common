'use client'

import { StickyNote } from './StickyNote'
import type { HomepageStickyNotesProps } from './types'
import { useStickyNoteStack } from './useStickyNoteStack'

export const HomepageStickyNotes = ({ notes }: HomepageStickyNotesProps) => {
  const { getZIndex, frontIndex, bringToFront } = useStickyNoteStack(notes.length)

  return (
    <div className="sticky-notes-wrapper">
      {notes.map((note, index) => (
        <StickyNote
          key={note.id ?? `sticky-note-${index}`}
          note={note}
          zIndex={getZIndex(index)}
          isFront={index === frontIndex}
          onActivate={() => bringToFront(index)}
        />
      ))}
    </div>
  )
}
