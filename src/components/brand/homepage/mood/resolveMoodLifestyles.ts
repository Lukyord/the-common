import type { Homepage } from '@/payload-types'
import type { HomeLifestyle } from '@/payload/queries/home'

export function resolveMoodLifestyles(
  moodLifestyles: Homepage['whatAreYouInTheMoodFor'] extends { lifestyles?: infer L } ? L : never,
  fallback: HomeLifestyle[],
): HomeLifestyle[] {
  const fromRecommender = (moodLifestyles ?? []).flatMap((item): HomeLifestyle[] => {
    if (typeof item === 'number' || !item.text) return []
    return [{ id: item.id, text: item.text }]
  })

  return fromRecommender.length > 0 ? fromRecommender : fallback
}
