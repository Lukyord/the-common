'use client'

import { useCallback, useEffect, useId, useRef, useState, type PropsWithChildren } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { scrollToY } from '@/utils/functions/scrollTo'

import { TabContext, type TabContextValue } from './tab-context'
import { registerTabContainer, unregisterTabContainer, tabContainers } from './use-tab-control'

declare global {
    interface Window {
        updateMatchHeight?: () => void
    }
}

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

type TabContainerProps = PropsWithChildren<{
    defaultActiveTab?: string
    scrollToTop?: boolean
    className?: string
    containerId?: string
    updateUrlHash?: boolean
}>

export function TabContainer({
    children,
    defaultActiveTab,
    scrollToTop = false,
    className = '',
    containerId,
    updateUrlHash = true,
}: TabContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const generatedId = useId()
    const [activeTab, setActiveTabState] = useState<string | null>(defaultActiveTab || null)
    const activeTabRef = useRef(activeTab)
    activeTabRef.current = activeTab
    const id = containerId ?? generatedId

    // Handle hash-based tab activation
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash && containerRef.current) {
                const hash = window.location.hash
                const tabLink = containerRef.current.querySelector<HTMLAnchorElement>(
                    `.tab a[href="${hash}"]`,
                )
                if (tabLink) {
                    const tabId = tabLink.getAttribute('href')
                    if (tabId) {
                        setActiveTabState(tabId)
                    }
                }
            }
        }

        // Check hash on mount
        handleHashChange()

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange)

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [])

    // Handle scroll to top when tab changes
    useEffect(() => {
        if (scrollToTop && activeTab && containerRef.current) {
            const timeoutId = setTimeout(() => {
                const headerHeight = document.getElementById('header-height')
                const headerHeightValue = headerHeight ? headerHeight.offsetHeight : 0
                const tabContainerRect = containerRef.current!.getBoundingClientRect()
                const scrollTop = tabContainerRect.top + window.scrollY - headerHeightValue + 1
                scrollToY(scrollTop)
            }, 250)

            return () => clearTimeout(timeoutId)
        }
    }, [activeTab, scrollToTop])

    const setActiveTab = useCallback((tabId: string) => {
        setActiveTabState(tabId)

        // Update URL hash if it's a hash-based tab and updateUrlHash is enabled
        if (updateUrlHash && tabId.startsWith('#')) {
            window.history.pushState(null, '', tabId)
        }

        // Update MatchHeight after tab content is shown (if available)
        if (typeof window !== 'undefined' && window.updateMatchHeight) {
            setTimeout(() => {
                window.updateMatchHeight?.()
            }, 100)
        }
    }, [updateUrlHash])

    // Register this container in the global registry
    useEffect(() => {
        const getActiveTab = () => activeTabRef.current
        registerTabContainer(id, setActiveTab, getActiveTab)

        return () => {
            unregisterTabContainer(id)
        }
    }, [id, setActiveTab])

    // Update subscribers when activeTab changes
    useEffect(() => {
        const container = tabContainers.get(id)
        if (container) {
            container.getActiveTab = () => activeTab
            container.subscribers.forEach((subscriber) => subscriber(activeTab))
        }
    }, [id, activeTab])

    useEffect(() => {
        if (!activeTab) return

        const frame = requestAnimationFrame(() => {
            ScrollTrigger.refresh()
        })

        return () => cancelAnimationFrame(frame)
    }, [activeTab])

    const contextValue: TabContextValue = {
        activeTab,
        setActiveTab,
        containerId: id,
        scrollToTop,
    }

    const containerClasses = `tab-container ${scrollToTop ? 'scrolltop' : ''} ${className}`.trim()

    return (
        <TabContext.Provider value={contextValue}>
            <div ref={containerRef} className={containerClasses} id={id}>
                {children}
            </div>
        </TabContext.Provider>
    )
}
