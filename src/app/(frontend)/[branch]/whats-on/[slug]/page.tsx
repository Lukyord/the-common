import type { Metadata } from 'next'

import WhatsOnSingle from '@/components/whats-on-single/WhatsOnSingle'
import { generateMeta } from '@/lib/generateMeta'
import { getWhatsOnBySlug } from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch, slug } = await params
  const event = await getWhatsOnBySlug(branch, slug)

  return generateMeta({
    meta: event.meta,
    fallbackTitle: event.title,
    fallbackDescription: event.date ? `${event.title} — ${event.date}` : event.title,
  })
}

export default async function EventSinglePage({ params }: Props) {
  const { branch: branchSlug, slug } = await params
  const event = await getWhatsOnBySlug(branchSlug, slug)

  return (
    <main id="main" className="whats-on-single-page">
      <WhatsOnSingle
        event={event}
        backHref={`/${branchSlug}/whats-on`}
        getTagHref={(tag) => `/whats-on/filter?tag=${encodeURIComponent(tag)}`}
      />
    </main>
  )
}
