'use client'

import { type PropsWithChildren } from 'react'
import { useAccordionContext } from './accordion-context'

type AccordionItemProps = PropsWithChildren<{
    itemId: string
    className?: string
}>

export function AccordionItem({ children, itemId, className = '' }: AccordionItemProps) {
    const { isActive } = useAccordionContext()
    const active = isActive(itemId)

    return (
        <div
            className={`accordion ${active ? 'active' : ''} ${className}`.trim()}
            data-item-id={itemId}
        >
            {children}
        </div>
    )
}

