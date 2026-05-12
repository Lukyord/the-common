'use client'

import { createContext, useContext } from 'react'

export type AccordionContextValue = {
    activeItems: Set<string>
    toggleItem: (itemId: string) => void
    registerPanel: (itemId: string, element: HTMLDivElement | null) => void
    isActive: (itemId: string) => boolean
    toggle: boolean
}

export const AccordionContext = createContext<AccordionContextValue | null>(null)

export function useAccordionContext() {
    const context = useContext(AccordionContext)
    if (!context) {
        throw new Error('Accordion components must be used within AccordionContainer')
    }
    return context
}

