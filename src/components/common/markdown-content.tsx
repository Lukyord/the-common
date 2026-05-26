import type { ElementType, ReactNode } from 'react'
import { marked } from 'marked'

import { HtmlContent } from '@/components/common/html-content'

marked.setOptions({ breaks: true, gfm: true })

const PHRASING_HOST_TAGS = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'p', 'span'])

type MarkdownContentProps = {
  as?: ElementType
  className?: string
  inline?: boolean
  children?: ReactNode
}

export function markdownToHtml(markdown: string, inline = false) {
  const options = { async: false as const }

  return inline
    ? marked.parseInline(markdown, options)
    : marked.parse(markdown, options)
}

export function MarkdownContent({
  as,
  className,
  inline = false,
  children,
}: MarkdownContentProps) {
  if (typeof children !== 'string' || !children.trim()) {
    return null
  }

  const useInline =
    inline || (typeof as === 'string' && PHRASING_HOST_TAGS.has(as.toLowerCase()))

  return (
    <HtmlContent as={as} className={className}>
      {markdownToHtml(children, useInline)}
    </HtmlContent>
  )
}
