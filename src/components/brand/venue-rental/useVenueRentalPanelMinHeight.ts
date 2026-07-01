'use client'

import { useCallback, useEffect, useRef } from 'react'

const MOBILE_QUERY = '(max-width: 991px)'
const MEASURING_CLASS = 'is-measuring'

function measurePanelContents(container: HTMLElement) {
  const tabContents = container.querySelectorAll<HTMLElement>('.tab-content')
  let maxHeight = 0

  tabContents.forEach((tabContent) => {
    const panelContent = tabContent.querySelector<HTMLElement>('.venue-rental-panel__content')
    if (!panelContent) return

    tabContent.classList.add(MEASURING_CLASS)
    maxHeight = Math.max(maxHeight, panelContent.offsetHeight)
    tabContent.classList.remove(MEASURING_CLASS)
  })

  return maxHeight
}

export function useVenueRentalPanelMinHeight(activeTab: string | null) {
  const containerRef = useRef<HTMLDivElement>(null)

  const sync = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    requestAnimationFrame(() => {
      if (!window.matchMedia(MOBILE_QUERY).matches) {
        container.style.removeProperty('--venue-rental-panel-min-height')
        return
      }

      const maxHeight = measurePanelContents(container)
      if (maxHeight > 0) {
        container.style.setProperty('--venue-rental-panel-min-height', `${maxHeight}px`)
      }
    })
  }, [])

  useEffect(() => {
    sync()

    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const onResize = () => sync()

    mediaQuery.addEventListener('change', onResize)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(sync)

    return () => {
      mediaQuery.removeEventListener('change', onResize)
      window.removeEventListener('resize', onResize)
    }
  }, [sync, activeTab])

  return containerRef
}
