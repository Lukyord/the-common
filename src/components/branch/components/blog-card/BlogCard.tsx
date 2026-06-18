import Link from 'next/link'

import RenderMedia from '@/components/common/media'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

type BlogCardProps = {
  media?: {
    src: string
    alt?: string
  }
  title: string
  date?: string
  link?: string
}

export default function BlogCard({ media, title, date, link }: BlogCardProps) {
  const cardContent = (
    <>
      <div className="card-media">
        {media?.src && <RenderMedia src={media.src} alt={media.alt || title} />}
      </div>

      <div className="card-desc">
        {date && <p className="type-d-label type-caption letter-spacing-002">{date}</p>}
      </div>

      <div className="card-ttl">
        <h3 className="type-d-body-l type-m-s letter-spacing-002 weight-medium">{title}</h3>
      </div>
    </>
  )

  return (
    <AnimateOnScroll triggerClass="fadeIn" data-card="blog" className="card">
      {link ? (
        <Link href={link} className="link-overlay" aria-label={title}>
          &nbsp;
        </Link>
      ) : null}
      {cardContent}
    </AnimateOnScroll>
  )
}
