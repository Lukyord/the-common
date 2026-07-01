import type { FancyboxInstance } from '@fancyapps/ui'

type SlideWithClose = {
  el?: HTMLElement
  closeButtonEl?: HTMLElement
}

function positionSlideCloseButton(slide: SlideWithClose) {
  const closeButton = slide.closeButtonEl
  const slideEl = slide.el
  if (!closeButton || !slideEl) return

  const wrapper = slideEl.querySelector('.f-panzoom__wrapper')
  const media = slideEl.querySelector('.f-panzoom__content')
  if (!(wrapper instanceof HTMLElement) || !(media instanceof HTMLElement)) return

  //   const wrapperRect = wrapper.getBoundingClientRect()
  //   const mediaRect = media.getBoundingClientRect()

  //   closeButton.style.top = `${mediaRect.top - wrapperRect.top}px`
  //   closeButton.style.right = `${wrapperRect.right - mediaRect.right}px`
  //   closeButton.style.left = 'auto'
  //   closeButton.style.bottom = 'auto'

  if (media instanceof HTMLImageElement && !media.complete) {
    media.addEventListener('load', () => positionSlideCloseButton(slide), { once: true })
  }
}

export function positionFancyboxCloseButton(instance: FancyboxInstance) {
  const slide = instance.getSlide() as SlideWithClose | undefined
  if (slide) {
    positionSlideCloseButton(slide)
    return
  }

  const carousel = instance.getCarousel()
  carousel?.getSlides().forEach((item) => positionSlideCloseButton(item as SlideWithClose))
}

const resizeObservers = new WeakMap<FancyboxInstance, ResizeObserver>()

export function observeFancyboxCloseButton(instance: FancyboxInstance) {
  positionFancyboxCloseButton(instance)

  const existingObserver = resizeObservers.get(instance)
  existingObserver?.disconnect()

  const slide = instance.getSlide() as SlideWithClose | undefined
  const wrapper = slide?.el?.querySelector('.f-panzoom__wrapper')
  if (!(wrapper instanceof HTMLElement)) return

  const observer = new ResizeObserver(() => positionFancyboxCloseButton(instance))
  observer.observe(wrapper)

  const media = wrapper.querySelector('.f-panzoom__content')
  if (media instanceof HTMLElement) {
    observer.observe(media)
  }

  resizeObservers.set(instance, observer)
}

export function unobserveFancyboxCloseButton(instance: FancyboxInstance) {
  resizeObservers.get(instance)?.disconnect()
  resizeObservers.delete(instance)
}
