import type { ElementType, ReactNode } from 'react'

type HtmlContentProps = {
  as?: ElementType
  className?: string
  children?: ReactNode
}

export function HtmlContent({ as: Tag = 'div', className, children }: HtmlContentProps) {
  if (typeof children !== 'string' || !children.trim()) {
    return null
  }

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: children }} />
}
