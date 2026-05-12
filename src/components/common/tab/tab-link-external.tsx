'use client'

import { type PropsWithChildren, type ElementType } from 'react'
import { useTabControl } from './use-tab-control'

type TabLinkExternalProps = PropsWithChildren<{
    containerId: string
    tabId: string
    className?: string
    as?: ElementType
    href?: string
    onClick?: (e: React.MouseEvent) => void
}>

export function TabLinkExternal({
    children,
    containerId,
    tabId,
    className = '',
    as: Component = 'a',
    href,
    onClick,
}: TabLinkExternalProps) {
    const { activeTab, setActiveTab } = useTabControl(containerId)

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setActiveTab(tabId)
        if (onClick) {
            onClick(e)
        }
    }

    const isActive = activeTab === tabId
    const linkHref = href || tabId

    return (
        <Component
            href={linkHref}
            className={`${isActive ? 'active' : ''} ${className}`.trim()}
            onClick={handleClick}
            data-tab-link={tabId}
        >
            {children}
        </Component>
    )
}

