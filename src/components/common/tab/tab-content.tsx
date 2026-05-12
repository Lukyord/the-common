'use client'

import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { useTabContext } from './tab-context'

type TabContentProps = PropsWithChildren<{
    tabId: string
    className?: string
    innerClassName?: string
}>

export function TabContent({
    children,
    tabId,
    className = '',
    innerClassName = '',
}: TabContentProps) {
    const { activeTab } = useTabContext()
    const contentRef = useRef<HTMLDivElement>(null)
    const [isClosing, setIsClosing] = useState(false)

    const isActive = activeTab === tabId

    useEffect(() => {
        if (!isActive && contentRef.current?.classList.contains('active')) {
            // Tab is being closed
            setIsClosing(true)
            const timeoutId = setTimeout(() => {
                setIsClosing(false)
            }, 500)

            return () => clearTimeout(timeoutId)
        }
    }, [isActive])

    const contentClasses =
        `tab-content ${isActive ? 'active' : ''} ${isClosing ? 'closing' : ''} ${className}`.trim()

    return (
        <div ref={contentRef} className={contentClasses} data-tab-content={tabId}>
            {innerClassName ? <div className={innerClassName}>{children}</div> : children}
        </div>
    )
}
