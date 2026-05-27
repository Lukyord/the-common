import Link from 'next/link'
import type { CSSProperties } from 'react'

import RenderMedia from '@/components/common/media'
import type { MoodVendorBranch } from '@/components/brand/homepage/mood/mapMoodVendorCard'
import { MarkdownContent } from '@/components/common/markdown-content'

type MoodCardProps = {
  contentKey: string | number
  media: {
    src: string
    alt: string
  }
  title: string
  branch?: MoodVendorBranch
  link?: string
  priority?: boolean
}

export const MoodCard = ({
  contentKey,
  media,
  title,
  branch,
  link,
  priority = false,
}: MoodCardProps) => {
  return (
    <div data-card="mood" className="card">
      {link && (
        <Link href={link} className="link-overlay" aria-label={title}>
          &nbsp;
        </Link>
      )}
      <div className="card-media">
        <div className="clip-hexagon-2">
          {media.src && <RenderMedia src={media.src} alt={media.alt} priority={priority} />}
        </div>
      </div>
      <div key={`title-${contentKey}`} className="card-ttl fadeIn">
        <MarkdownContent
          as="h3"
          className="type-d-title weight-medium type-m-title letter-spacing-002 uppercase"
        >
          {title}
        </MarkdownContent>
      </div>
      {branch && (
        <div
          key={`branch-${contentKey}`}
          className="branch fadeIn"
          style={
            {
              '--bg-color': branch.bgColor,
              '--color': branch.color,
            } as CSSProperties
          }
        >
          <p className="type-d-body-m uppercase letter-spacing-002 weight-medium">{branch.name}</p>
        </div>
      )}
    </div>
  )
}
