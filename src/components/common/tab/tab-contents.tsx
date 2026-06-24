'use client'

import { forwardRef, type PropsWithChildren } from 'react'

type TabContentsProps = PropsWithChildren<{
    className?: string
}>

export const TabContents = forwardRef<HTMLDivElement, TabContentsProps>(function TabContents(
    { children, className = '' },
    ref,
) {
    return (
        <div ref={ref} className={`tab-contents ${className}`.trim()}>
            {children}
        </div>
    )
})
