'use client'

import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { onWindowResize } from '@/utils/utils'
import { AccordionContext, type AccordionContextValue } from './accordion-context'

type AccordionContainerProps = PropsWithChildren<{
    toggle?: boolean
    triggerFirst?: boolean
    className?: string
    defaultActiveItems?: string[]
}>

export function AccordionContainer({
    children,
    toggle = false,
    triggerFirst = false,
    className = '',
    defaultActiveItems = [],
}: AccordionContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeItems, setActiveItems] = useState<Set<string>>(new Set(defaultActiveItems))

    // Set panel height using CSS variable
    const setPanelHeights = () => {
        if (!containerRef.current) return

        const panels = containerRef.current.querySelectorAll<HTMLDivElement>('.entry-panel')
        panels.forEach((panel) => {
            const originalHeight = panel.style.height
            panel.style.height = 'auto'
            const fullHeight = panel.offsetHeight
            panel.style.height = originalHeight
            panel.style.setProperty('--accordion-height', `${fullHeight}px`)
        })
    }

    // Set heights on init and on window resize
    useEffect(() => {
        // Wait for next tick to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            setPanelHeights()
        }, 0)

        // Set heights on window resize
        const cleanup = onWindowResize(() => {
            setPanelHeights()
        })

        return () => {
            clearTimeout(timeoutId)
            cleanup()
        }
    }, [children])

    // Trigger first accordion if needed
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
                // Toggle mode: only one open at a time
                if (newSet.has(itemId)) {
                    // If clicking the active item, don't close it (as per original JS logic)
                    return newSet
                } else {
                    // Close all others and open this one
                    return new Set([itemId])
                }
            } else {
                // Regular mode: toggle individual items
                if (newSet.has(itemId)) {
                    newSet.delete(itemId)
                } else {
                    newSet.add(itemId)
                }
                return newSet
            }
        })
    }

    const isActive = (itemId: string) => activeItems.has(itemId)

    const containerClasses =
        `accordion-container ${toggle ? 'toggle' : ''} ${triggerFirst ? 'trigger-first' : ''} ${className}`.trim()

    const contextValue: AccordionContextValue = {
        activeItems,
        toggleItem: handleToggle,
        registerPanel: () => {}, // No longer needed, but keeping for compatibility
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
