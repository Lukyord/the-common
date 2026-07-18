import type { Metadata } from 'next'

import BlogSingle from '@/components/brand/blog-single/BlogSingle'
import { generateMeta } from '@/lib/generateMeta'
import { getBlogBySlug } from '@/payload/queries/blogs'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  return generateMeta({
    meta: blog.meta,
    fallbackTitle: blog.title,
    fallbackDescription: blog.date ? `${blog.title} — ${blog.date}` : blog.title,
    pathname: `/blogs/${slug}`,
  })
}

export default async function BlogSinglePage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  return (
    <main id="main" className="blogs-single-page">
      <BlogSingle blog={blog} backHref="/blogs" />
    </main>
  )
}
