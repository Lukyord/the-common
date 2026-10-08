import type Lenis from 'lenis'

export const SCROLL_DURATION = 0.8

declare global {
  interface Window {
    __lenis?: Lenis | null
    __autoScrollCleanup?: () => void
  }
}

let lenisInstance: Lenis | null = null

export function registerLenis(lenis: Lenis | null): void {
  lenisInstance = lenis
  // Used by reels/auto-scroll.js when recording page animations
  if (typeof window !== 'undefined') {
    window.__lenis = lenis
  }
}

type ScrollOptions = {
  immediate?: boolean
  offset?: number
  duration?: number
}

export function scrollToY(targetY: number, options: ScrollOptions = {}): void {
  const { immediate = false, offset = 0, duration = SCROLL_DURATION } = options

  if (lenisInstance) {
    lenisInstance.scrollTo(targetY, { offset, immediate, duration })
    return
  }

  window.scrollTo({
    top: targetY + offset,
    behavior: immediate ? 'auto' : 'smooth',
  })
}

export function scrollToElement(element: HTMLElement, options: ScrollOptions = {}): void {
  const { immediate = false, offset = 0, duration = SCROLL_DURATION } = options

  if (lenisInstance) {
    lenisInstance.scrollTo(element, { offset, immediate, duration })
    return
  }

  const targetY = element.getBoundingClientRect().top + window.scrollY + offset
  scrollToY(targetY, { immediate, duration })
}

export function scrollToTop(options: Pick<ScrollOptions, 'immediate'> = {}): void {
  scrollToY(0, { immediate: options.immediate ?? true })
}
