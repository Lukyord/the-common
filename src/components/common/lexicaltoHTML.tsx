'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { lexicalToHtml } from '@/lib/lexicalToHtml'

export const LexicalToHTML = ({ data }: { data: SerializedEditorState }) => {
  const html = lexicalToHtml(data)

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
