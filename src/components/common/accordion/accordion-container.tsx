'use client'

import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { onWindowResize } from '@/utils/utils'
import { AccordionContext, type AccordionContextValue } from './accordion-context'

type AccordionContainerProps = PropsWithChildren<{
  toggle?: boolean
  triggerFirst?: boolean
  className?: string
  defaultActiveItems?: string[]
}>

function measurePanel(panel: HTMLDivElement) {
  const inner = panel.querySelector<HTMLElement>('.entry-panel-inner')

  if (inner) {
    return Math.ceil(inner.getBoundingClientRect().height)
  }

  const originalHeight = panel.style.height
  panel.style.height = 'auto'
  const fullHeight = panel.offsetHeight
  panel.style.height = originalHeight

  return Math.ceil(fullHeight)
}

export function AccordionContainer({
  children,
  toggle = false,
  triggerFirst = false,
  className = '',
  defaultActiveItems = [],
}: AccordionContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set(defaultActiveItems))

  const setPanelHeights = useCallback(() => {
    if (!containerRef.current) return

    containerRef.current.querySelectorAll<HTMLDivElement>('.entry-panel').forEach((panel) => {
      panel.style.setProperty('--accordion-height', `${measurePanel(panel)}px`)
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const timeoutId = window.setTimeout(setPanelHeights, 0)
    const cleanupResize = onWindowResize(setPanelHeights)

    const observers: ResizeObserver[] = []

    containerRef.current.querySelectorAll<HTMLElement>('.entry-panel-inner').forEach((inner) => {
      const panel = inner.closest<HTMLDivElement>('.entry-panel')
      if (!panel) return

      const observer = new ResizeObserver(() => {
        panel.style.setProperty('--accordion-height', `${measurePanel(panel)}px`)
      })

      observer.observe(inner)
      observers.push(observer)
    })

    const fontsReady = document.fonts?.ready.then(setPanelHeights)

    return () => {
      window.clearTimeout(timeoutId)
      cleanupResize()
      observers.forEach((observer) => observer.disconnect())
      void fontsReady
    }
  }, [children, setPanelHeights])

  useEffect(() => {
    const frameId = requestAnimationFrame(setPanelHeights)
    return () => cancelAnimationFrame(frameId)
  }, [activeItems, setPanelHeights])

  useEffect(() => {
    if (triggerFirst && containerRef.current) {
      const firstAccordion = containerRef.current.querySelector('.accordion')
      if (firstAccordion) {
        const firstItemId = firstAccordion.getAttribute('data-item-id')
        if (firstItemId) {
          setActiveItems(new Set([firstItemId]))
        }
      }
    }
  }, [triggerFirst])

  const handleToggle = (itemId: string) => {
    setActiveItems((prev) => {
      const newSet = new Set(prev)

      if (toggle) {
        if (newSet.has(itemId)) {
          return newSet
        }

        return new Set([itemId])
      }

      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }

      return newSet
    })
  }

  const isActive = (itemId: string) => activeItems.has(itemId)

  const containerClasses =
    `accordion-container ${toggle ? 'toggle' : ''} ${triggerFirst ? 'trigger-first' : ''} ${className}`.trim()

  const contextValue: AccordionContextValue = {
    activeItems,
    toggleItem: handleToggle,
    registerPanel: () => {},
    isActive,
    toggle,
  }

  return (
    <AccordionContext.Provider value={contextValue}>
      <div ref={containerRef} className={containerClasses}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}
