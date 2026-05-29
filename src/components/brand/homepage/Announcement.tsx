'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import RenderMedia from '@/components/common/media'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Homepage } from '@/payload-types'

type AnnouncementProps = {
  show?: Homepage['announcementShow']
  data?: Homepage['announcement']
}

const CLIP_BY_FORMAT = {
  square: 'clip-hexagon-square',
  vertical: 'clip-hexagon-portrait',
  landscape: 'clip-hexagon-landscape',
} as const

export function Announcement({ show, data }: AnnouncementProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (show) setOpen(true)
  }, [show])

  const media = resolveMedia(data?.media)

  if (!show || !data || !media) return null

  const format = data?.format ?? 'square'
  const clipClass = CLIP_BY_FORMAT[format] ?? CLIP_BY_FORMAT.square

  const close = () => setOpen(false)

  return (
    <div
      data-lenis-prevent
      className={`announcement ${open ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={close}
    >
      <div className={`media ${format}`} onClick={(event) => event.stopPropagation()}>
        <div className={clipClass}>
          {data?.link && (
            <Link href={data.link} className="link-overlay">
              &nbsp;
            </Link>
          )}
          <RenderMedia src={media.src} alt={media.alt} />
        </div>
        <button type="button" className="announcement-close" onClick={close} aria-label="Close">
          <i className="ic ic-close-bold" aria-hidden />
        </button>
      </div>
    </div>
  )
}
