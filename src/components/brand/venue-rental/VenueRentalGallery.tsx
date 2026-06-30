'use client'

import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import RenderMedia from '@/components/common/media'
import type { ContentSingleGalleryItem } from '@/components/common/content-single/types'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import type { CSSProperties } from 'react'

type VenueRentalGalleryProps = {
  items: ContentSingleGalleryItem[]
  bgColor?: string | null
}

export default function VenueRentalGallery({ items, bgColor }: VenueRentalGalleryProps) {
  if (!items.length) {
    return null
  }

  return (
    <div className="venue-rental-gallery dark-bg">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        pagination={{ clickable: true }}
        slidesPerView={1}
        observer
        observeParents
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={`${item.src}-${index}`}>
            <div
              className="gallery-media"
              style={{ backgroundColor: bgColor ?? undefined } as CSSProperties}
            >
              <RenderMedia src={item.src} alt={item.alt} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
