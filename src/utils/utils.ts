/*::* RESIZE *::*/
type ResizeCallback = () => void

type WindowResizeOptions = {
  delay?: number
  executeOnLoad?: boolean
  initialCallback?: ResizeCallback
}

export function onWindowResize(
  callback: ResizeCallback,
  { delay = 300, executeOnLoad = true, initialCallback }: WindowResizeOptions = {},
): () => void {
  let lastWidth = window.innerWidth
  let resizeTimeout: number | undefined
  let initialCallbackExecuted = false

  if (executeOnLoad && typeof callback === 'function') {
    callback()
  }

  const handler = () => {
    const newWidth = window.innerWidth

    if (newWidth !== lastWidth) {
      lastWidth = newWidth

      if (!initialCallbackExecuted && typeof initialCallback === 'function') {
        initialCallbackExecuted = true
        initialCallback()
      }

      if (resizeTimeout !== undefined) {
        window.clearTimeout(resizeTimeout)
      }

      resizeTimeout = window.setTimeout(() => {
        if (typeof callback === 'function') {
          callback()
        }
        initialCallbackExecuted = false
      }, delay)
    }
  }

  window.addEventListener('resize', handler)

  return () => {
    window.removeEventListener('resize', handler)
    if (resizeTimeout !== undefined) {
      window.clearTimeout(resizeTimeout)
    }
  }
}

export function onWindowResizeInstant(
  callback: ResizeCallback,
  executeOnLoad: boolean = true,
): () => void {
  let lastWidth = window.innerWidth

  if (executeOnLoad && typeof callback === 'function') {
    callback()
  }

  const handler = () => {
    const newWidth = window.innerWidth

    if (newWidth !== lastWidth) {
      lastWidth = newWidth
      if (typeof callback === 'function') {
        callback()
      }
    }
  }

  window.addEventListener('resize', handler)

  return () => {
    window.removeEventListener('resize', handler)
  }
}

/*::*  IS MOBILE VIEWPORT *::*/
const MOBILE_BREAKPOINT = 991

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= MOBILE_BREAKPOINT
}
