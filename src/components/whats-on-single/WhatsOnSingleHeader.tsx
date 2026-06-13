import Link from 'next/link'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import type { WhatsOnSingleData } from '@/payload/queries/branch'

import WhatsOnSingleInfo from './WhatsOnSingleInfo'

type WhatsOnSingleHeaderProps = {
  event: Pick<WhatsOnSingleData, 'title' | 'mainTag' | 'subTags' | 'date' | 'time' | 'branches'>
  getTagHref: (tag: string) => string
  showInfo: boolean
}

export default function WhatsOnSingleHeader({
  event,
  getTagHref,
  showInfo,
}: WhatsOnSingleHeaderProps) {
  return (
    <div className="sc-header">
      <div className="sc-ttl-tags">
        <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
          <MarkdownContent
            as="h1"
            className="type-d-title type-m-title letter-spacing-002 weight-medium"
          >
            {event.title}
          </MarkdownContent>
        </AnimateOnScroll>

        {(event.mainTag || event.subTags.length > 0) && (
          <AnimateOnScroll triggerClass="fadeIn" className="sc-tags">
            {event.mainTag && (
              <Link href={getTagHref(event.mainTag)} className="tag main">
                <p className="type-d-body-xs type-m-caption letter-spacing-002">{event.mainTag}</p>
              </Link>
            )}
            {event.subTags.map((tag) => (
              <Link key={tag} href={getTagHref(tag)} className="tag sub">
                <p className="type-d-body-xs type-m-caption letter-spacing-002">{tag}</p>
              </Link>
            ))}
          </AnimateOnScroll>
        )}
      </div>

      {showInfo && (
        <WhatsOnSingleInfo date={event.date} time={event.time} branches={event.branches} />
      )}
    </div>
  )
}
