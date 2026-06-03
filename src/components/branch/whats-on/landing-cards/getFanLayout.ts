import type { FanAnchor } from './fanAnchorConfig'

/** Max rotation (deg) on the last card; first card stays near 0. */
const MAX_ROTATION = 30
/** Total horizontal distance from last card (pivot) to first card, as a fraction of card width. */
const HORIZONTAL_SPREAD_PER_GAP = 0.05
/** Max vertical offset (px) from last to first card. */
const MAX_VERTICAL_OFFSET = -30

export function getFanLayout(
  index: number,
  total: number,
  cardWidth: number,
  cardHeight: number,
  playfieldWidth: number,
  playfieldHeight: number,
  anchor: FanAnchor,
) {
  const anchorX = (playfieldWidth * anchor.xPercent) / 100
  const anchorY = (playfieldHeight * anchor.yPercent) / 100

  if (total <= 1) {
    return {
      x: anchorX,
      y: anchorY - cardHeight,
      rotation: 0,
    }
  }

  const lastIndex = total - 1
  const t = index / lastIndex - 0.15

  const horizontalSpread = cardWidth * HORIZONTAL_SPREAD_PER_GAP * lastIndex
  const x = anchorX + horizontalSpread * (1 - t)
  const y = anchorY - cardHeight + MAX_VERTICAL_OFFSET * (1 - t)
  const rotation = -MAX_ROTATION * t

  return { x, y, rotation }
}

export function getInitialCardZIndex(cardIndex: number, total: number) {
  return total - cardIndex
}
