import Link from 'next/link'

import RenderMedia from '@/components/common/media'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

export type WhatsOnImageCardProps = {
  media?: {
    src: string
    alt?: string
  }
  fancyboxGroup?: string
}

export default function WhatsOnImageCard({ media, fancyboxGroup }: WhatsOnImageCardProps) {
  if (!media?.src) return null

  return (
    <AnimateOnScroll
      triggerClass="fadeIn"
      data-card="whats-on-image"
      className={`card${fancyboxGroup ? ' is-fancybox' : ''}`}
    >
      <div className="card-media">
        <RenderMedia src={media.src} alt={media.alt} />

        <div className="icon">
          <i className="ic ic-zoom"></i>
        </div>
      </div>
      {fancyboxGroup && (
        <Link data-fancybox={fancyboxGroup} href={media.src} className="link-overlay">
          &nbsp;
        </Link>
      )}
    </AnimateOnScroll>
  )
}
