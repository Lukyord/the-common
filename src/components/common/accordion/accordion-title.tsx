'use client'

import { type PropsWithChildren, type ElementType } from 'react'
import { useAccordionContext } from './accordion-context'

type AccordionTitleProps = PropsWithChildren<{
    itemId: string
    className?: string
    as?: ElementType
}>

export function AccordionTitle({
    children,
    itemId,
    className = '',
    as: Component = 'div',
}: AccordionTitleProps) {
    const { toggleItem } = useAccordionContext()

    return (
        <Component className={`entry-title ${className}`.trim()} onClick={() => toggleItem(itemId)}>
            {children}
        </Component>
    )
}

