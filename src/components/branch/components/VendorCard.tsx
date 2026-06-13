import Link from 'next/link'

import RenderMedia from '@/components/common/media'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import {
  CardBranchDots,
  type CardBranchDotItem,
} from '@/components/branch/components/card-branch-dots'

type VendorCardProps = {
  branchSlug?: string | null
  branches?: CardBranchDotItem[]
  media?: {
    src: string
    alt?: string
  }
  title: string
  tags?: string[]
  location?: string
  link?: string
}

export default function VendorCard({
  branchSlug,
  branches = [],
  media,
  title,
  tags = [],
  location,
  link,
}: VendorCardProps) {
  const cardContent = (
    <>
      <div className="card-media">
        {media?.src && <RenderMedia src={media.src} alt={media.alt || title} />}
      </div>

      <div className="card-ttl">
        <h3 className="type-d-body-l type-m-s letter-spacing-002 weight-medium">{title}</h3>

        <CardBranchDots branches={branches} />
      </div>

      <div className="card-desc">
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.map((tag) => (
              <Link
                href={`/vendors/filter?branch=${branchSlug}&category=${tag}`}
                key={tag}
                className="tag"
              >
                <p className="type-d-body-xs type-m-body-xs letter-spacing-002">{tag}</p>
              </Link>
            ))}
          </div>
        )}

        {location && <p className="type-d-label type-caption letter-spacing-002">{location}</p>}
      </div>
    </>
  )

  return (
    <AnimateOnScroll triggerClass="fadeIn" data-card="vendor" className="card">
      {link ? (
        <Link href={link} className="link-overlay" aria-label={title}>
          &nbsp;
        </Link>
      ) : null}
      {cardContent}
    </AnimateOnScroll>
  )
}
