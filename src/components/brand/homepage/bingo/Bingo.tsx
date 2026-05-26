'use client'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { useEffect, useRef, useState } from 'react'
import { BingoStamp } from './BingoStamp'
import { DragCursor } from './DragCursor'
import { toGridItems } from './toGridItems'
import type { BingoProps } from './types'
import { useBingoDrag } from './useBingoDrag'
import { useDragCursor } from './useDragCursor'
import Image from 'next/image'

const CONGRATS_VISIBLE_MS = 2000

export const Bingo = ({ data }: BingoProps) => {
  const sectionRef = useRef<HTMLElement>(null)
  const playfieldRef = useRef<HTMLDivElement>(null)
  const gridItems = toGridItems(data?.grid)
  const dragCursor = useDragCursor()
  const bingo = useBingoDrag(sectionRef, playfieldRef, {
    onPointerMove: dragCursor.updatePosition,
  })
  const showDragCursor = dragCursor.isActive && !bingo.isDragging
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    if (bingo.bingoWinCount === 0) return
    setShowCongrats(true)
    const timer = setTimeout(() => setShowCongrats(false), CONGRATS_VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [bingo.bingoWinCount])

  if (!data?.title && gridItems.every((item) => !item.text)) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      data-section="bingo"
      {...dragCursor.getSectionProps(bingo.isDragging)}
    >
      {showDragCursor && <DragCursor x={dragCursor.position.x} y={dragCursor.position.y} />}
      <div className="sc-inner">
        <div className="container">
          <div className="bingo-interactive" ref={playfieldRef}>
            <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl text-wrap-balance">
              <h2 className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium">
                {data?.title}
              </h2>
            </AnimateOnScroll>

            <div className="bingo-grid">
              <div className={`bingo-congrats${showCongrats ? ' is-visible' : ''}`}>
                <picture className="object-fit">
                  <Image
                    src="/designs/bingo.webp"
                    alt="Bingo Congrats"
                    fill
                    sizes="100%"
                    draggable={false}
                  />
                </picture>
              </div>

              {gridItems.map((item, cellIndex) => {
                const stampIndex = bingo.cellStamps[cellIndex]
                const layout = stampIndex !== null ? bingo.getStampLayout(stampIndex) : null
                const showSnappedStamp =
                  stampIndex !== null && layout !== null && bingo.drag?.stampIndex !== stampIndex

                return (
                  <div key={item.id} className="bingo-grid-item" data-cell-index={cellIndex}>
                    {item.text && (
                      <p className="type-d-body-m letter-spacing-002 weight-medium">{item.text}</p>
                    )}
                    {showSnappedStamp && (
                      <BingoStamp
                        stampIndex={stampIndex}
                        layout={layout}
                        isSnapped
                        zIndex={bingo.getStampZIndex(stampIndex)}
                        isDragging={false}
                        onPointerDown={bingo.onStampPointerDown(stampIndex, cellIndex)}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div ref={bingo.poolMeasureRef} className="bingo-stamps-pool" aria-hidden>
              <div className="bingo-stamps-pool-slot" />
            </div>

            {bingo.layoutsReady && (
              <div className="bingo-stamps-layer">
                {Array.from({ length: 9 }).map((_, stampIndex) => {
                  const isOnGrid = bingo.cellStamps.includes(stampIndex)
                  const isDraggingStamp = bingo.drag?.stampIndex === stampIndex
                  if (isOnGrid && !isDraggingStamp) return null

                  const layout = bingo.getStampLayout(stampIndex)
                  if (!layout) return null

                  const fromCell = bingo.cellStamps.indexOf(stampIndex)
                  return (
                    <BingoStamp
                      key={stampIndex}
                      stampIndex={stampIndex}
                      layout={layout}
                      zIndex={bingo.getStampZIndex(stampIndex)}
                      isDragging={isDraggingStamp}
                      onPointerDown={bingo.onStampPointerDown(
                        stampIndex,
                        fromCell >= 0 ? fromCell : null,
                      )}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
