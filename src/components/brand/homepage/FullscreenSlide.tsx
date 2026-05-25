'use client'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import RenderMedia from '@/components/common/media'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Homepage } from '@/payload-types'
import Link from 'next/link'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { Pagination, Autoplay } from 'swiper/modules'

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
      <div className="cover">
        <RenderMedia src="/designs/crm-bg.webp" alt="Membership Background" />
      </div>
      <div className="sc-inner pc-t-75 pc-b-75 mb-t-100 mb-b-100">
        <div className="container">
          <Swiper
            autoplay={{ delay: 10000 }}
            loop={true}
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            speed={1000}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="membership-item">
                  <div className="item-content">
                    <div className="item-header">
                      {slide.title && (
                        <AnimateOnScroll triggerClass="fadeIn" className="item-ttl">
                          <h3 className="type-d-header type-m-headliner-m weight-medium letter-spacing-002">
                            {slide.title}
                          </h3>
                        </AnimateOnScroll>
                      )}
                      {slide.description && (
                        <AnimateOnScroll triggerClass="fadeIn" className="item-desc">
                          <p className="type-d-body-l type-m-title letter-spacing-002">
                            {slide.description}
                          </p>
                        </AnimateOnScroll>
                      )}
                    </div>
                    {slide.button?.text && slide.button?.link && (
                      <AnimateOnScroll triggerClass="fadeIn" className="item-cta">
                        <Link href={slide.button.link} className="button-orange">
                          <span>
                            <span>{slide.button.text}</span>
                          </span>
                        </Link>
                      </AnimateOnScroll>
                    )}
                  </div>

                  {slide.media?.src && (
                    <div className="item-media">
                      <AnimateOnScroll triggerClass="fadeIn" className="item-media-inner">
                        <RenderMedia src={slide.media.src} alt={slide.media.alt} />
                      </AnimateOnScroll>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
