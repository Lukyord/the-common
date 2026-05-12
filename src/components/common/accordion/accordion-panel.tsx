'use client'

import { type PropsWithChildren } from 'react'

type AccordionPanelProps = PropsWithChildren<{
    itemId: string
    className?: string
    innerClassName?: string
}>

export function AccordionPanel({
    children,
    itemId,
    className = '',
    innerClassName = '',
}: AccordionPanelProps) {
    return (
        <div className={`entry-panel ${className}`.trim()}>
            {innerClassName ? <div className={innerClassName}>{children}</div> : children}
        </div>
    )
}
