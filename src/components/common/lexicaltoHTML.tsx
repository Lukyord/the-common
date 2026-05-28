'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import AnimatedRichText from '@/components/common/AnimatedRichText'
import { lexicalToHtml } from '@/lib/lexicalToHtml'

export const LexicalToHTML = ({ data }: { data: SerializedEditorState }) => {
  const html = lexicalToHtml(data)

  return <AnimatedRichText html={html} />
}
