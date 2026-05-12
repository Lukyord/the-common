'use client'

import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { TabContext, type TabContextValue } from './tab-context'
import { registerTabContainer, unregisterTabContainer, tabContainers } from './use-tab-control'

type TabContainerProps = PropsWithChildren<{
    defaultActiveTab?: string
    scrollToTop?: boolean
    className?: string
    containerId?: string
    updateUrlHash?: boolean
}>

function smoothScrollTo(targetY: number, duration: number) {
    const startY = window.scrollY
    const distance = targetY - startY
    let startTime: number | null = null

    function easeOutExpo(t: number) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)
        const ease = easeOutExpo(progress)

        window.scrollTo(0, startY + distance * ease)

        if (timeElapsed < duration) {
            requestAnimationFrame(animation)
        }
    }

    requestAnimationFrame(animation)
}

export function TabContainer({
    children,
    defaultActiveTab,
    scrollToTop = false,
    className = '',
    containerId,
    updateUrlHash = true,
}: TabContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTabState] = useState<string | null>(defaultActiveTab || null)
    const id = containerId || `tab-container-${Math.random().toString(36).substring(2, 11)}`

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
                smoothScrollTo(scrollTop, 800)
            }, 250)

            return () => clearTimeout(timeoutId)
        }
    }, [activeTab, scrollToTop])

    const setActiveTab = (tabId: string) => {
        setActiveTabState(tabId)

        // Update URL hash if it's a hash-based tab and updateUrlHash is enabled
        if (updateUrlHash && tabId.startsWith('#')) {
            window.history.pushState(null, '', tabId)
        }

        // Update MatchHeight after tab content is shown (if available)
        if (
            typeof window !== 'undefined' &&
            typeof (window as any).updateMatchHeight === 'function'
        ) {
            setTimeout(() => {
                ;(window as any).updateMatchHeight()
            }, 100)
        }
    }

    // Register this container in the global registry
    useEffect(() => {
        const getActiveTab = () => activeTab
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
