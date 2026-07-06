import Link from 'next/link'
import type { CSSProperties } from 'react'

import type { LotDefinition } from '@/constants/vendorMapData/index'

import { getAspectRatioFromViewBox, getWidthFromViewBox } from '../lib/types'

type MapLotProps = LotDefinition & {
  lotNumber?: number
  mapKey?: string
  interactive?: boolean
  isActive?: boolean
  defaultColor: string
  activeColor: string
  href?: string
  label?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

function getLotShapes({ shapePath, labelPath, shapes }: LotDefinition): LotDefinition['shapes'] {
  if (shapes?.length) return shapes
  if (shapePath && labelPath) return [{ shapePath, labelPath }]
  return []
}

export default function MapLot({
  lotNumber,
  mapKey,
  interactive = true,
  isActive = false,
  defaultColor,
  activeColor,
  viewBox,
  shapePath,
  labelPath,
  shapes,
  layout,
  href,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: MapLotProps) {
  const lotShapes = getLotShapes({ viewBox, shapePath, labelPath, shapes })
  if (!layout || !lotShapes?.length) return null

  const style = {
    top: layout.top,
    left: layout.left,
    width: getWidthFromViewBox(viewBox),
    aspectRatio: getAspectRatioFromViewBox(viewBox),
    '--lot-default-color': defaultColor,
    '--lot-active-color': activeColor,
  } as CSSProperties

  const dataLot = mapKey ?? lotNumber
  const ariaLabel = label
    ? lotNumber
      ? `${label}, lot ${lotNumber}`
      : label
    : lotNumber
      ? `Lot ${lotNumber}`
      : undefined

  const lotSvg = (
    <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      {lotShapes.map((lotShape, index) => (
        <g key={index}>
          <path className="lot__shape" d={lotShape.shapePath} />
          <path className="lot__label" opacity="0.9" d={lotShape.labelPath} />
        </g>
      ))}
    </svg>
  )

  const lotClassName = ['lot', !interactive && 'lot--map-only', isActive && 'is-active']
    .filter(Boolean)
    .join(' ')

  if (!interactive) {
    return (
      <div
        className={lotClassName}
        data-lot={dataLot}
        style={style}
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
      >
        {lotSvg}
      </div>
    )
  }

  if (href) {
    return (
      <Link
        href={href}
        className={lotClassName}
        data-lot={dataLot}
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={ariaLabel}
      >
        {lotSvg}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={lotClassName}
      data-lot={dataLot}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={ariaLabel}
    >
      {lotSvg}
    </button>
  )
}
