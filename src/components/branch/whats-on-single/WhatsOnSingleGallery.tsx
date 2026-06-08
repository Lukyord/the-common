'use client'

import type { CSSProperties } from 'react'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import RenderMedia from '@/components/common/media'

import 'swiper/css'
import 'swiper/css/pagination'

type GalleryItem = {
  src: string
  alt: string
}

type WhatsOnSingleGalleryProps = {
  items: GalleryItem[]
  bgColor?: string | null
}

export default function WhatsOnSingleGallery({ items, bgColor }: WhatsOnSingleGalleryProps) {
  if (!items.length) return null

  return (
    <div
      className="content-gallery dark-bg"
      style={{ backgroundColor: bgColor ?? undefined } as CSSProperties}
    >
      <Swiper modules={[Pagination]} pagination={{ clickable: true }} slidesPerView={1}>
        {items.map((item, index) => (
          <SwiperSlide key={`${item.src}-${index}`}>
            <div className="gallery-media">
              <RenderMedia src={item.src} alt={item.alt} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
