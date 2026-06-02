import type { Metadata } from 'next'

import NotFoundContent from '@/components/common/NotFoundContent'
import { generateMeta } from '@/lib/generateMeta'

export const metadata: Metadata = generateMeta({
  fallbackTitle: 'Page not found | The Common',
  fallbackDescription: 'The page you are looking for could not be found.',
})

export default function NotFound() {
  return <NotFoundContent />
}
