'use client'

import { useState, type CSSProperties, type KeyboardEvent } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import { resolveMedia } from '@/lib/resolveMedia'

import type { StickyNote as StickyNoteData } from './types'

type StickyNoteProps = {
  note: StickyNoteData
  zIndex: number
  isFront: boolean
  onActivate: () => void
}

export const StickyNote = ({ note, zIndex, isFront, onActivate }: StickyNoteProps) => {
  const [heartEdgeActive, setHeartEdgeActive] = useState(false)
  const media = resolveMedia(note.media)
  const hasMedia = Boolean(media?.src)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <AnimateOnScroll
      triggerClass="fadeIn"
      className={['sticky-note', heartEdgeActive && 'heart-edge-animate'].filter(Boolean).join(' ')}
      onEnter={() => {
        if (note.shape === 'heart') {
          setHeartEdgeActive(true)
        }
      }}
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
      data-has-media={hasMedia || undefined}
    >
      {hasMedia && media ? (
        <div className="sticky-note-media">
          <RenderMedia src={media.src} alt={media.alt} />
        </div>
      ) : (
        note.text && (
          <div className="sticky-note-text">
            <MarkdownContent as="p" className="type-d-header weight-medium letter-spacing-002">
              {note.text}
            </MarkdownContent>
          </div>
        )
      )}
    </AnimateOnScroll>
  )
}
