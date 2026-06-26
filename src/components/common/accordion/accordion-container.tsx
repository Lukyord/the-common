'use client'

import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { onWindowResize } from '@/utils/utils'
import { scrollToElement } from '@/utils/functions/scrollTo'
import { AccordionContext, type AccordionContextValue } from './accordion-context'

type AccordionContainerProps = PropsWithChildren<{
  toggle?: boolean
  triggerFirst?: boolean
  scrollToTop?: boolean
  className?: string
  defaultActiveItems?: string[]
}>

const ACCORDION_OPEN_TRANSITION_MS = 550

function getHeaderOffset(): number {
  return document.getElementById('header')?.offsetHeight ?? 0
}

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
  scrollToTop = false,
  className = '',
  defaultActiveItems = [],
}: AccordionContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prevActiveItemsRef = useRef<Set<string>>(new Set())
  const userInteractedRef = useRef(false)
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set(defaultActiveItems))

  const scrollOpenedItemIntoView = useCallback((itemId: string) => {
    if (!containerRef.current) return

    const item = containerRef.current.querySelector<HTMLElement>(
      `.accordion[data-item-id="${itemId}"]`,
    )

    if (!item) return

    scrollToElement(item, { offset: -(getHeaderOffset() - 1), duration: 2 })
  }, [])

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

  useEffect(() => {
    if (!scrollToTop || !userInteractedRef.current) {
      prevActiveItemsRef.current = activeItems
      return
    }

    const prev = prevActiveItemsRef.current
    const openedItemId = [...activeItems].find((itemId) => !prev.has(itemId))
    prevActiveItemsRef.current = activeItems

    if (!openedItemId) {
      userInteractedRef.current = false
      return
    }

    userInteractedRef.current = false

    const timeoutId = window.setTimeout(() => {
      scrollOpenedItemIntoView(openedItemId)
    }, ACCORDION_OPEN_TRANSITION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [activeItems, scrollToTop, scrollOpenedItemIntoView])

  const handleToggle = (itemId: string) => {
    userInteractedRef.current = true

    setActiveItems((prev) => {
      const newSet = new Set(prev)

      if (toggle) {
        if (newSet.has(itemId)) {
          userInteractedRef.current = false
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
    `accordion-container ${toggle ? 'toggle' : ''} ${triggerFirst ? 'trigger-first' : ''} ${scrollToTop ? 'scrolltop' : ''} ${className}`.trim()

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
