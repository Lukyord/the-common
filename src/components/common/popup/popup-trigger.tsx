'use client'

import React, { ReactNode, ElementType } from 'react'

type PopupTriggerProps<T extends ElementType = 'button'> = {
  children: ReactNode
  className?: string
  as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, 'className'>

export default function PopupTrigger<T extends ElementType = 'button'>({
  children,
  className = '',
  as,
  ...props
}: PopupTriggerProps<T>) {
  const Component = as || ('button' as ElementType)

  return (
    <Component className={`popup-trigger ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}
