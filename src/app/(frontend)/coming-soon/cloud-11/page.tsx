import type { Metadata } from 'next'

import NotFoundContent from '@/components/common/NotFoundContent'
import { generateMeta } from '@/lib/generateMeta'

export const metadata: Metadata = generateMeta({
  fallbackTitle: 'Coming soon | The Common',
  fallbackDescription: 'Cloud11 is coming soon. Please check back later.',
  pathname: '/coming-soon/cloud-11',
})

export default function Cloud11ComingSoonPage() {
  return (
    <NotFoundContent
      title="theCOMMONS CLOUD11 COMING SOON"
      description="Building the next wholesome community in south Sukhumvit"
      titleId="coming-soon-title"
    />
  )
}
