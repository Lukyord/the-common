import { detectTouchEvents, detectDevice } from '@/utils/functions/dom'
import { updateScrollTheme } from '@/utils/functions/scroll'
import { initializeVideos } from '@/utils/functions/video'

export function initTheme(): void {
  detectTouchEvents()
  detectDevice()
  updateScrollTheme()
  initializeVideos()
}
