'use client'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'

import RenderMedia from '@/components/common/media'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Homepage } from '@/payload-types'

type FullscreenSlideProps = {
  slides?: Homepage['membership']
}

function toSlides(items: NonNullable<Homepage['membership']>) {
  return items.map((item, index) => ({
    id: item.id ?? `membership-${index}`,
    title: item.title,
    description: item.description,
    button: item.button,
    media: resolveMedia(item.media),
  }))
}

export const FullscreenSlide = ({ slides: membershipSlides }: FullscreenSlideProps) => {
  const slides = membershipSlides?.length ? toSlides(membershipSlides) : []

  if (slides.length === 0) return null

  return (
    <section data-section="fullscreen-slide">
      <div className="sc-inner">
        <Swiper>
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="membership-item">
                {slide.media?.src && (
                  <div className="item-media">
                    <RenderMedia src={slide.media.src} alt={slide.media.alt} />
                  </div>
                )}
                {slide.title && <h2>{slide.title}</h2>}
                {slide.description && <p>{slide.description}</p>}
                {slide.button?.text && slide.button?.link && (
                  <a href={slide.button.link}>{slide.button.text}</a>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
