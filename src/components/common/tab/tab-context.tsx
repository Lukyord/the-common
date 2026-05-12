'use client'

import { createContext, useContext } from 'react'

export type TabContextValue = {
    activeTab: string | null
    setActiveTab: (tabId: string) => void
    containerId: string
    scrollToTop?: boolean
}

export const TabContext = createContext<TabContextValue | null>(null)

export function useTabContext() {
    const context = useContext(TabContext)
    if (!context) {
        throw new Error('Tab components must be used within TabContainer')
    }
    return context
}
