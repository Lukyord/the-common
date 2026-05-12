'use client'

import React, { ReactNode, ElementType } from 'react'

type PopupContentProps<T extends ElementType = 'div'> = {
  children: ReactNode
  className?: string
  as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, 'className'>

export default function PopupContent<T extends ElementType = 'div'>({
  children,
  className = '',
  as,
  ...props
}: PopupContentProps<T>) {
  const Component = as || ('div' as ElementType)

  return (
    <Component className={`popup-content ${className}`.trim()} {...props}>
      {children}
    </Component>
  )
}
