/**
 * DOM / browser utilities.
 *
 * All helpers are defensive against SSR (they no-op when `window` / `document`
 * are not available), so they are safe to import in Next.js components.
 */

/*::* DETECT *::*/
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function detectTouchEvents(): void {
  if (!isBrowser()) return

  const html = document.documentElement

  const isTouchSupported =
    'ontouchstart' in window ||
    (navigator as Navigator & { msMaxTouchPoints?: number }).maxTouchPoints > 0 ||
    ((navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0

  if (isTouchSupported) {
    html.classList.add('touchevents')
    html.classList.remove('no-touchevents')
  } else {
    html.classList.remove('touchevents')
    html.classList.add('no-touchevents')
  }
}

export function detectDevice(): void {
  if (!isBrowser()) return

  const html = document.documentElement

  const isDevice = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/.test(
    navigator.userAgent,
  )

  if (isDevice) {
    html.classList.add('is-device')
  } else {
    html.classList.remove('is-device')
  }
}
