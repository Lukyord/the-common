import Link from 'next/link'

import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import WhatsOnCardTip from './WhatsOnCardTip'

type WhatsOnCardProps = {
  branchSlug?: string | null
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
  branchSlug,
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
      className="card"
      style={
        { '--bg-color': themeColor?.bgColor, '--color': themeColor?.color } as React.CSSProperties
      }
    >
      <WhatsOnCardTip color={backgroundColor} />

      {media?.src && (
        <div className="card-media">
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
        <div className="card-date-time type-d-label type-m-body-s letter-spacing-002">
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
            className="type-d-body-l type-m-title letter-spacing-002 weight-medium"
          >
            {title}
          </MarkdownContent>
        </div>
      </div>
      <div className="card-tags">
        {mainTag && (
          <Link
            href={`/whats-on/filter?branch=${branchSlug}&mainTag=${mainTag}`}
            className="tag main"
          >
            <p className="type-d-body-xs type-m-caption letter-spacing-002">{mainTag}</p>
          </Link>
        )}
        {subTags.length > 0 &&
          subTags.map((tag) => (
            <div key={tag} className="tag sub">
              <p className="type-d-body-xs type-m-caption letter-spacing-002">{tag}</p>
            </div>
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
