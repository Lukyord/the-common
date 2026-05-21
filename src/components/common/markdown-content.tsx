import type { ElementType } from 'react'
import { marked } from 'marked'

import { HtmlContent } from '@/components/common/html-content'

marked.setOptions({ breaks: true, gfm: true })

type MarkdownContentProps = {
  as?: ElementType
  className?: string
  inline?: boolean
  markdown?: string | null
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
  markdown,
}: MarkdownContentProps) {
  if (!markdown?.trim()) {
    return null
  }

  const html = markdownToHtml(markdown, inline)

  return <HtmlContent as={as} className={className} html={html} />
}
