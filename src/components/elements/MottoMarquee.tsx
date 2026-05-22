import React from 'react'

import HorizontalMarquee from '@/components/common/horizontal-marquee'

export type MottoShape = 'hexagon' | 'circle' | 'square'

export type MottoItem = {
  id?: string | null
  text?: string | null
  shape?: MottoShape | null
}

export type MottoMarqueeProps = {
  items?: MottoItem[] | null
}

export function MottoMarquee({ items }: MottoMarqueeProps) {
  const mottoItems = items?.filter((item) => item.text?.trim()) ?? []

  if (mottoItems.length === 0) {
    return null
  }

  return (
    <div className="motto-marquee">
      <HorizontalMarquee speed={25} direction="left">
        <div className="motto-marquee__strip">
          {mottoItems.map((item, index) => (
            <div key={item.id ?? index} className="motto-marquee__item">
              <span className="shape" data-shape={item.shape}></span>
              <span className="type-d-body-s type-m-body-r letter-spacing-003">{item.text}</span>
            </div>
          ))}
        </div>
      </HorizontalMarquee>
    </div>
  )
}
