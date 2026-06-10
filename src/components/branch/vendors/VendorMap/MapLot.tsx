import type { CSSProperties } from 'react'

import {
  getAspectRatioFromViewBox,
  getWidthFromViewBox,
  type LotDefinition,
} from './types'

type MapLotProps = LotDefinition & {
  lotNumber: number
  defaultColor: string
  activeColor: string
  onClick?: () => void
}

export default function MapLot({
  lotNumber,
  defaultColor,
  activeColor,
  viewBox,
  shapePath,
  labelPath,
  layout,
  onClick,
}: MapLotProps) {
  if (!layout) return null

  return (
    <button
      type="button"
      className="lot"
      data-lot={lotNumber}
      style={
        {
          top: layout.top,
          left: layout.left,
          width: getWidthFromViewBox(viewBox),
          aspectRatio: getAspectRatioFromViewBox(viewBox),
          '--lot-default-color': defaultColor,
          '--lot-active-color': activeColor,
        } as CSSProperties
      }
      onClick={onClick}
      aria-label={`Lot ${lotNumber}`}
    >
      <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="lot__shape" d={shapePath} />
        <path className="lot__label" opacity="0.9" d={labelPath} />
      </svg>
    </button>
  )
}
