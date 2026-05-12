'use client'

import { type PropsWithChildren, type ElementType } from 'react'
import { useTabContext } from './tab-context'

type TabLinkProps = PropsWithChildren<{
    tabId: string
    className?: string
    as?: ElementType
    href?: string
    onClick?: (e: React.MouseEvent) => void
}>

export function TabLink({
    children,
    tabId,
    className = '',
    as: Component = 'a',
    href,
    onClick,
}: TabLinkProps) {
    const { activeTab, setActiveTab } = useTabContext()

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
