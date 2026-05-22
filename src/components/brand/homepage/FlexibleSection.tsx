'use client'

import { useState } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'
import { Controller, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/controller'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

import RenderMedia from '@/components/common/media'
import { lexicalToHtml } from '@/lib/lexicalToHtml'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Homepage } from '@/payload-types'

type FlexibleSectionProps = {
  show?: Homepage['flexibleSectionShow']
  items?: Homepage['flexibleSection']
}

function toSlides(items: NonNullable<Homepage['flexibleSection']>) {
  return items.map((item, index) => ({
    id: item.id ?? `flexible-${index}`,
    title: item.title,
    descriptionHtml: lexicalToHtml(item.description) || undefined,
    bgColor: item.bgColor,
    media: resolveMedia(item.media),
  }))
}

export function FlexibleSection({ show, items }: FlexibleSectionProps) {
  const [textSwiper, setTextSwiper] = useState<SwiperInstance | null>(null)
  const [mediaSwiper, setMediaSwiper] = useState<SwiperInstance | null>(null)

  if (!show || !items?.length) {
    return null
  }

  const slides = toSlides(items)

  return (
    <section data-section="flexible">
      <div className="text-slide">
        <Swiper
          modules={[Controller, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{ clickable: true }}
          onSwiper={setTextSwiper}
          controller={{ control: mediaSwiper }}
        >
          {slides.map((slide) => (
            <SwiperSlide
              key={slide.id}
              style={slide.bgColor ? { backgroundColor: slide.bgColor } : undefined}
            >
              <div className="slide-item">
                {slide.title ? <h2>{slide.title}</h2> : null}
                {slide.descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: slide.descriptionHtml }} />
                ) : null}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="media-slide">
        <Swiper
          modules={[Controller, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          onSwiper={setMediaSwiper}
          controller={{ control: textSwiper }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="slide-item">
                {slide.media?.src ? (
                  <RenderMedia src={slide.media.src} alt={slide.media.alt} />
                ) : null}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
