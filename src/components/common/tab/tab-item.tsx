'use client'

import { type PropsWithChildren } from 'react'
import { useTabContext } from './tab-context'

type TabItemProps = PropsWithChildren<{
    tabId: string
    className?: string
}>

export function TabItem({ children, tabId, className = '' }: TabItemProps) {
    const { activeTab } = useTabContext()
    const isActive = activeTab === tabId

    return (
        <div className={`tab ${isActive ? 'active' : ''} ${className}`.trim()} data-tab-id={tabId}>
            {children}
        </div>
    )
}
