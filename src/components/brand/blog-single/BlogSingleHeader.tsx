import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import WhatsOnSingleInfo from '@/components/whats-on-single/WhatsOnSingleInfo'
import type { BlogSingleData } from '@/payload/queries/blogs'

type BlogSingleHeaderProps = {
  blog: Pick<BlogSingleData, 'title' | 'date' | 'branches'>
  showInfo: boolean
}

export default function BlogSingleHeader({ blog, showInfo }: BlogSingleHeaderProps) {
  return (
    <div className="sc-header">
      <div className="sc-ttl-tags">
        <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
          <MarkdownContent
            as="h1"
            className="type-d-title type-m-title letter-spacing-002 weight-medium"
          >
            {blog.title}
          </MarkdownContent>
        </AnimateOnScroll>
      </div>

      {showInfo && <WhatsOnSingleInfo publishedDate={blog.date} branches={blog.branches} />}
    </div>
  )
}
