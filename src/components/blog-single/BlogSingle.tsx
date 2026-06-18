import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { ContentSingleLayout } from '@/components/common/content-single'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import { isWhatsOnArchived } from '@/lib/whatsOnArchive'

import BlogSingleHeader from './BlogSingleHeader'
import type { BlogSingleProps } from './types'

export default function BlogSingle({ blog, backHref }: BlogSingleProps) {
  const showInfo = !isWhatsOnArchived(blog)

  return (
    <ContentSingleLayout
      section="blog-single"
      sectionClassName="blog-single"
      backHref={backHref}
      gallery={{ items: blog.gallery }}
    >
      <BlogSingleHeader blog={blog} showInfo={showInfo} />

      {blog.content && (
        <AnimateOnScroll triggerClass="fadeIn" className="sc-content entry-content">
          <LexicalToHTML data={blog.content as SerializedEditorState} />
        </AnimateOnScroll>
      )}

      {blog.buttonText && blog.buttonLink && (
        <AnimateOnScroll triggerClass="fadeIn" className="sc-cta">
          <Link
            href={blog.buttonLink}
            className="button-template"
            style={{ '--button-bg-color': 'var(--color-saladaeng-orange)' } as React.CSSProperties}
          >
            <span>
              <span>{blog.buttonText}</span>
            </span>
          </Link>
        </AnimateOnScroll>
      )}
    </ContentSingleLayout>
  )
}
