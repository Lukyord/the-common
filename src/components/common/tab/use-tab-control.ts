'use client'

import { useEffect, useState, useCallback } from 'react'

// Global registry to store tab containers by ID
type TabContainerData = {
    setActiveTab: (tabId: string) => void
    getActiveTab: () => string | null
    subscribers: Set<(activeTab: string | null) => void>
}

export const tabContainers = new Map<string, TabContainerData>()

export function registerTabContainer(
    containerId: string,
    setActiveTab: (tabId: string) => void,
    getActiveTab: () => string | null,
) {
    const data: TabContainerData = {
        setActiveTab,
        getActiveTab,
        subscribers: new Set(),
    }
    tabContainers.set(containerId, data)
    
    // Notify all subscribers of the initial state
    const activeTab = getActiveTab()
    data.subscribers.forEach((subscriber) => subscriber(activeTab))
}

export function unregisterTabContainer(containerId: string) {
    tabContainers.delete(containerId)
}

export function useTabControl(containerId: string) {
    const [activeTab, setActiveTabState] = useState<string | null>(null)

    useEffect(() => {
        const container = tabContainers.get(containerId)
        if (!container) {
            return
        }

        // Set initial state
        setActiveTabState(container.getActiveTab())

        // Subscribe to updates
        const subscriber = (newActiveTab: string | null) => {
            setActiveTabState(newActiveTab)
        }
        container.subscribers.add(subscriber)

        return () => {
            container.subscribers.delete(subscriber)
        }
    }, [containerId])

    const setActiveTab = useCallback(
        (tabId: string) => {
            const container = tabContainers.get(containerId)
            if (container) {
                container.setActiveTab(tabId)
            }
        },
        [containerId],
    )

    return { activeTab, setActiveTab }
}

