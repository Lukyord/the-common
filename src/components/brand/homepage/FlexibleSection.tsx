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
  const [activeIndex, setActiveIndex] = useState(0)

  const slides = (show && items?.length && toSlides(items)) || []
  const activeBgColor = slides[activeIndex]?.bgColor

  const handleSlideChange = (swiper: SwiperInstance) => {
    setActiveIndex(swiper.activeIndex)
  }

  return (
    show &&
    slides.length > 0 && (
      <section
        data-section="flexible"
        style={activeBgColor ? { backgroundColor: activeBgColor } : undefined}
      >
        <div className="text-slide">
          <Swiper
            modules={[Controller, EffectFade, Pagination]}
            autoHeight={true}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            pagination={{ clickable: true }}
            onSwiper={setTextSwiper}
            onSlideChange={handleSlideChange}
            controller={{ control: mediaSwiper }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="slide-item">
                  <div className="slide-item-inner">
                    {slide.title && (
                      <div className="item-ttl">
                        <h2 className="type-d-header type-m-headliner-m weight-medium letter-spacing-002">
                          {slide.title}
                        </h2>
                      </div>
                    )}
                    {slide.descriptionHtml && (
                      <div dangerouslySetInnerHTML={{ __html: slide.descriptionHtml }} />
                    )}
                  </div>
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
            onSlideChange={handleSlideChange}
            controller={{ control: textSwiper }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="slide-item">
                  {slide.media?.src && <RenderMedia src={slide.media.src} alt={slide.media.alt} />}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    )
  )
}
