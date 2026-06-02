import Link from 'next/link'

import RenderMedia from '@/components/common/media'

type VendorCardProps = {
  media?: {
    src: string
    alt?: string
  }
  title: string
  tags?: string[]
  location?: string
  link?: string
}

export default function VendorCard({ media, title, tags = [], location, link }: VendorCardProps) {
  const cardContent = (
    <>
      <div className="card-media">
        {media?.src && <RenderMedia src={media.src} alt={media.alt || title} />}
      </div>

      <div className="card-ttl">
        <h3 className="type-d-body-l type-m-title letter-spacing-002 weight-medium">{title}</h3>
      </div>

      <div className="card-desc">
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.map((tag) => (
              <Link href={`/vendors?tag=${tag}`} key={tag} className="tag">
                <p className="type-d-body-xs type-m-body-s letter-spacing-002">{tag}</p>
              </Link>
            ))}
          </div>
        )}

        {location && <p className="type-d-label type-caption letter-spacing-002">{location}</p>}
      </div>
    </>
  )

  return (
    <div data-card="vendor" className="card">
      {link ? (
        <Link href={link} className="link-overlay" aria-label={title}>
          &nbsp;
        </Link>
      ) : null}
      {cardContent}
    </div>
  )
}
