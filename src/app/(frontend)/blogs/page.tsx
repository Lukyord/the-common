import React from 'react'
import type { Metadata } from 'next'

import BlogsListSection from '@/components/branch/blogs/BlogsListSection'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'
import { MarkdownContent } from '@/components/common/markdown-content'
import { generateMeta } from '@/lib/generateMeta'
import { resolveMedia } from '@/lib/resolveMedia'
import { getBlogPagePayloadData } from '@/payload/queries/blog-page'
import { getBlogsPage } from '@/payload/queries/blogs'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { blogPage } = await getBlogPagePayloadData()

  return generateMeta({
    meta: blogPage?.meta,
    fallbackTitle: blogPage?.hero?.title || 'Blog | The Common',
    fallbackDescription: 'Blog at The Common',
    pathname: '/blogs',
  })
}

export default async function BlogsPage() {
  const [{ blogPage }, blogsResult] = await Promise.all([getBlogPagePayloadData(), getBlogsPage()])
  const { hero } = blogPage ?? {}
  const heroBackground = resolveMedia(hero?.backgroundMedia)
  const heroBackgroundMobile = resolveMedia(hero?.mobileBackgroundMedia)

  return (
    <main id="main" className="whats-on-page">
      <section data-section="page-hero" className="bg-dark-brown">
        <div
          className="cover overlay"
          style={{ '--overlay-opacity': '0.2' } as React.CSSProperties}
        >
          {heroBackground?.src && (
            <RenderMedia
              src={heroBackground.src}
              srcMobile={heroBackgroundMobile?.src || heroBackground.src}
              alt={heroBackground.alt}
              priority
            />
          )}
        </div>
        <div className="sc-inner pc-t-100 pc-b-75 mb-t-100 mb-b-100">
          <div className="container">
            <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h1"
                inline
                className="type-d-display type-m-display weight-medium"
              >
                {hero?.title}
              </MarkdownContent>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
      <section data-section="blogs-list" className="bg-beige">
        <div className="sc-inner pc-t-50 pc-b-100 mb-t-50 mb-b-75">
          <BlogsListSection
            cards={blogsResult.cards}
            hasMore={blogsResult.hasMore}
            loadMoreUrl="/api/cards/blogs"
          />
        </div>
      </section>
    </main>
  )
}
