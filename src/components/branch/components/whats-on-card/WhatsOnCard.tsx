import Link from 'next/link'

import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import {
  CardBranchDots,
  type CardBranchDotItem,
} from '@/components/branch/components/card-branch-dots'
import WhatsOnCardTip from './WhatsOnCardTip'

export type WhatsOnCardProps = {
  className?: string
  branchSlug?: string | null
  branches?: CardBranchDotItem[]
  backgroundColor?: string | null
  themeColor?: {
    bgColor: string
    color: string
  }
  media?: {
    src: string
    alt?: string
  }
  title: string
  date?: string | null
  time?: string | null
  mainTag?: string | null
  subTags?: string[]
  highlightText?: string | null
  link?: string
}

export default function WhatsOnCard({
  className,
  branchSlug: _branchSlug,
  branches = [],
  backgroundColor,
  themeColor,
  media,
  title,
  date,
  time,
  mainTag,
  subTags = [],
  highlightText,
  link,
}: WhatsOnCardProps) {
  return (
    <AnimateOnScroll
      triggerClass="fadeIn"
      data-card="whats-on"
      className={`card ${className}`}
      style={
        { '--bg-color': themeColor?.bgColor, '--color': themeColor?.color } as React.CSSProperties
      }
    >
      {media?.src && (
        <div className="card-media">
          <WhatsOnCardTip color={backgroundColor} />
          <RenderMedia src={media.src} alt={media.alt || title} />

          {highlightText && (
            <div className="highlight">
              <p className="type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                {highlightText}
              </p>
            </div>
          )}
        </div>
      )}
      <div className="card-header">
        <div className="card-date-time type-d-label type-m-body-xs letter-spacing-002">
          {date && <span data-field="date">{date}</span>}
          {time && (
            <span data-field="time">
              {' '}
              <span className="separator">/</span> {time}
            </span>
          )}
        </div>

        <div className="card-ttl">
          <MarkdownContent
            as="h3"
            className="type-d-body-l type-m-body-s letter-spacing-002 weight-medium"
          >
            {title}
          </MarkdownContent>

          <CardBranchDots branches={branches} />
        </div>
      </div>
      <div className="card-tags">
        {mainTag && (
          <Link href={`/whats-on/filter?tag=${encodeURIComponent(mainTag)}`} className="tag main">
            <p className="type-d-body-xs type-m-caption letter-spacing-002">{mainTag}</p>
          </Link>
        )}
        {subTags.length > 0 &&
          subTags.map((tag) => (
            <Link
              key={tag}
              href={`/whats-on/filter?tag=${encodeURIComponent(tag)}`}
              className="tag sub"
            >
              <p className="type-d-body-xs type-m-caption letter-spacing-002">{tag}</p>
            </Link>
          ))}
      </div>

      {link && (
        <Link href={link} className="link-overlay">
          &nbsp;
        </Link>
      )}
    </AnimateOnScroll>
  )
}
