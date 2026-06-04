import type { CollectionBeforeChangeHook } from 'payload'

import {
  BRANCH_ABOUT_WORDS_BY_SLUG,
  type BranchAboutWord,
} from '@/constants/branchAboutWords'

type WordGroupRow = {
  word?: BranchAboutWord | null
  title?: string | null
  description?: string | null
  media?: number | null
  id?: string | null
}

function syncWordGroups(
  slug: string | undefined | null,
  existing?: WordGroupRow[] | null,
): WordGroupRow[] | undefined {
  if (!slug) return existing ?? undefined

  const words = BRANCH_ABOUT_WORDS_BY_SLUG[slug]
  if (!words) return existing ?? undefined

  return words.map((word) => {
    const row = existing?.find((item) => item.word === word)

    return {
      ...row,
      word,
    }
  })
}

export const syncBranchAboutWordGroups: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const slug = (data?.slug as string | undefined) ?? originalDoc?.slug
  const about = (data?.about as { wordGroups?: WordGroupRow[] } | undefined) ?? originalDoc?.about

  const wordGroups = syncWordGroups(slug, about?.wordGroups)

  if (!wordGroups) return data

  return {
    ...data,
    about: {
      ...about,
      ...((data?.about as object | undefined) ?? {}),
      wordGroups,
    },
  }
}
