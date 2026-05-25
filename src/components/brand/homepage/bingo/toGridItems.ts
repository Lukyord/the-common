import type { BingoGridItem } from './types'
import type { Homepage } from '@/payload-types'

export const BINGO_GRID_SIZE = 9

export function toGridItems(grid: NonNullable<Homepage['bingo']>['grid']): BingoGridItem[] {
  const items: BingoGridItem[] = (grid ?? []).map((item, index) => ({
    id: item.id ?? `bingo-grid-${index}`,
    text: item.text,
  }))

  while (items.length < BINGO_GRID_SIZE) {
    items.push({ id: `bingo-grid-${items.length}`, text: null })
  }

  return items.slice(0, BINGO_GRID_SIZE)
}
