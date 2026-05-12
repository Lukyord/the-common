'use client'

import { type PropsWithChildren } from 'react'

type TabContentsProps = PropsWithChildren<{
    className?: string
}>

export function TabContents({ children, className = '' }: TabContentsProps) {
    return <div className={`tab-contents ${className}`.trim()}>{children}</div>
}
