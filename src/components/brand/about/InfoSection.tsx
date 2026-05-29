import AnimateOnScroll from '@/components/common/animate-on-scroll'
import AnimatedRichText from '@/components/common/AnimatedRichText'
import RenderMedia from '@/components/common/media'
import { lexicalToHtml } from '@/lib/lexicalToHtml'
import { resolveMedia } from '@/lib/resolveMedia'
import type { About } from '@/payload-types'

import { MarkdownContent } from '@/components/common/markdown-content'

export type AboutInfoBlock = {
  id: string
  hexCode?: string | null
  title?: string | null
  descriptionHtml?: string
  media: ReturnType<typeof resolveMedia>
}

export type InfoSectionProps = {
  block: AboutInfoBlock
  reverse?: boolean
  priority?: boolean
  className?: string
}

export function toInfoBlocks(info: NonNullable<About['info']>): AboutInfoBlock[] {
  return info.map((item, index) => ({
    id: item.id ?? `info-${index}`,
    hexCode: item.hexCode,
    title: item.title,
    descriptionHtml: lexicalToHtml(item.richTextEditor) || undefined,
    media: resolveMedia(item.media),
  }))
}

export function InfoSection({ block, reverse = false, priority, className }: InfoSectionProps) {
  return (
    <section
      data-section="info-template"
      className={`${reverse && 'reverse'} ${className}`}
      style={block.hexCode ? { backgroundColor: block.hexCode } : undefined}
    >
      <AnimateOnScroll triggerClass="fadeIn" className="media-content">
        {block.media?.src && (
          <RenderMedia src={block.media.src} alt={block.media.alt} priority={priority} />
        )}
      </AnimateOnScroll>

      <div className="text-content">
        <div className="text-content-inner">
          {block.title && (
            <AnimateOnScroll triggerClass="fadeIn" className="text-content-title">
              <MarkdownContent
                as="h2"
                className="type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002"
              >
                {block.title}
              </MarkdownContent>
            </AnimateOnScroll>
          )}
          {block.descriptionHtml && <AnimatedRichText html={block.descriptionHtml} />}
        </div>
      </div>
    </section>
  )
}
