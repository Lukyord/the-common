import type { ElementType } from 'react'

type HtmlContentProps = {
  as?: ElementType
  className?: string
  html?: string | null
}

export function HtmlContent({ as: Tag = 'div', className, html }: HtmlContentProps) {
  if (!html?.trim()) {
    return null
  }

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
