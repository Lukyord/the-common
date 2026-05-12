'use client'

import { useEffect } from 'react'
import { initTheme } from '@/utils/theme'
import { onWindowResize, onWindowResizeInstant } from '@/utils/utils'
import { updateScrollTheme } from '@/utils/functions/scroll'

export default function Theme(): null {
  useEffect(() => {
    const cleanupResizeInstant = onWindowResizeInstant(() => {
      initTheme()
    })
    const cleanupResize = onWindowResize(
      () => document.documentElement.classList.remove('resizing'),
      {
        initialCallback: () => document.documentElement.classList.add('resizing'),
      },
    )

    // scroll setup
    const onScroll = () => {
      updateScrollTheme()
    }

    // initial run + listener
    updateScrollTheme()
    window.addEventListener('scroll', onScroll)

    return () => {
      cleanupResizeInstant()
      cleanupResize()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return null
}
