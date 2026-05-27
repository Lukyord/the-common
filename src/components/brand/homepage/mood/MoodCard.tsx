import Link from 'next/link'

import type { Media } from '@/payload-types'

import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'

type MoodCardProps = {
  media: {
    src: string
    alt: string
  }
  title: string
  branch?: {
    name: string
    bgColor: string
    color: string
  }
  link?: string
}

export const MoodCard = ({ media, title, branch, link }: MoodCardProps) => {
  return (
    <div data-card="mood" className="card">
      {link && (
        <Link href={link} className="link-overlay" aria-label={title}>
          &nbsp;
        </Link>
      )}
      <div className="card-media">
        <div className="clip-hexagon-2">
          {media.src && <RenderMedia src={media.src} alt={media.alt} />}
        </div>
      </div>
      <div className="card-ttl">
        <MarkdownContent
          as="h3"
          className="type-d-title weight-medium type-m-title letter-spacing-002 uppercase"
        >
          {title}
        </MarkdownContent>
      </div>
      {branch && (
        <div className="branch">
          <p className="type-d-body-m uppercase letter-spacing-002">{branch.name}</p>
        </div>
      )}
    </div>
  )
}
