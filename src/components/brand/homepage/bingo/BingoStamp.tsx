'use client'

import Image from 'next/image'
import type { CSSProperties, PointerEvent } from 'react'
import { getStampBlendConfig } from './stampBlendModes'
import type { StampLayout } from './types'

type BingoStampProps = {
  stampIndex: number
  layout: StampLayout
  zIndex: number
  isSnapped?: boolean
  isDragging: boolean
  onPointerDown: (event: PointerEvent<HTMLElement>) => void
}

export function BingoStamp({
  stampIndex,
  layout,
  zIndex,
  isSnapped = false,
  isDragging,
  onPointerDown,
}: BingoStampProps) {
  const blend = getStampBlendConfig(stampIndex)
  const blendStyle = {
    '--stamp-blend-mode': blend.mixBlendMode,
    ...(blend.opacity !== undefined && { '--stamp-opacity': blend.opacity }),
  } as CSSProperties

  return (
    <div
      className={`stamp${isSnapped ? ' is-snapped' : ''}${isDragging ? ' is-dragging' : ''}`}
      style={
        isSnapped
          ? { width: layout.width, height: layout.height, zIndex, ...blendStyle }
          : {
              left: layout.x,
              top: layout.y,
              width: layout.width,
              height: layout.height,
              zIndex,
              ...blendStyle,
            }
      }
      onPointerDown={onPointerDown}
    >
      <picture className="object-fit">
        <Image
          src={`/designs/bingo-${stampIndex + 1}.webp`}
          alt="Bingo Stamp"
          fill
          sizes="100%"
          draggable={false}
        />
      </picture>
    </div>
  )
}
