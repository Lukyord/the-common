import Link from 'next/link'

import RenderMedia from '@/components/common/media'

type WhatsOnCardProps = {
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
    <article data-card="whats-on">
      {media?.src && <RenderMedia src={media.src} alt={media.alt || title} />}
      <h3>{title}</h3>
      {mainTag && <p data-field="main-tag">{mainTag}</p>}
      {subTags.length > 0 && (
        <ul data-field="sub-tags">
          {subTags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
      {date && <p data-field="date">{date}</p>}
      {time && <p data-field="time">{time}</p>}
      {highlightText && <p data-field="highlight">{highlightText}</p>}
      {link && (
        <Link href={link} data-field="link">
          View
        </Link>
      )}
    </article>
  )
}
