'use client'

import type { CSSProperties, KeyboardEvent } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'

import type { StickyNote as StickyNoteData } from './types'

type StickyNoteProps = {
  note: StickyNoteData
  zIndex: number
  isFront: boolean
  onActivate: () => void
}

export const StickyNote = ({ note, zIndex, isFront, onActivate }: StickyNoteProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <AnimateOnScroll
      triggerClass="fadeIn"
      className="sticky-note"
      role="button"
      tabIndex={0}
      aria-pressed={isFront}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      style={
        {
          '--background-color': note.bgColor,
          '--text-color': note.textColor,
          zIndex,
        } as CSSProperties
      }
      data-shape={note.shape}
    >
      <div className="sticky-note-text">
        <MarkdownContent as="p" className="type-d-header weight-medium letter-spacing-002">
          {note.text}
        </MarkdownContent>
      </div>
    </AnimateOnScroll>
  )
}
