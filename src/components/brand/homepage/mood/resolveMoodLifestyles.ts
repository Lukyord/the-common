import type { Homepage } from '@/payload-types'
import type { HomeLifestyle } from '@/payload/queries/home'

export function resolveMoodLifestyles(
  recommenderLifestyles: Homepage['recommender'] extends { lifestyles?: infer L } ? L : never,
  fallback: HomeLifestyle[],
): HomeLifestyle[] {
  const fromRecommender = (recommenderLifestyles ?? []).flatMap((item): HomeLifestyle[] => {
    if (typeof item === 'number' || !item.text) return []
    return [{ id: item.id, text: item.text }]
  })

  return fromRecommender.length > 0 ? fromRecommender : fallback
}
