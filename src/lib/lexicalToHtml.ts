import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import type { Branch } from '@/payload-types'

type BranchRichText = Branch['findUs']
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { HTMLConvertersFunction } from '@payloadcms/richtext-lexical/html'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

const extendLinkFeature: HTMLConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  link: ({ node, nodesToHTML, providedStyleTag }) => {
    const children = nodesToHTML({ nodes: node.children }).join('')

    const classAttr = node.fields.displayStyle === 'button' ? ' class="button"' : ''

    const relValues = new Set(
      Array.isArray(node.fields.rel) ? node.fields.rel.filter(Boolean) : [],
    )
    if (node.fields.newTab) {
      relValues.add('noopener')
      relValues.add('noreferrer')
    }
    const relAttr = relValues.size ? ` rel="${Array.from(relValues).join(' ')}"` : ''
    const targetAttr = node.fields.newTab ? ' target="_blank"' : ''

    return `<a${classAttr}${providedStyleTag} href="${resolveHref(node)}"${relAttr}${targetAttr}>${children}</a>`
  },
})

const resolveHref = (node: SerializedLinkNode) => {
  if (node.fields.linkType === 'internal') {
    const docValue = node.fields.doc?.value
    if (typeof docValue === 'string' && docValue) {
      return docValue
    }
    if (docValue && typeof docValue === 'object') {
      if ('slug' in docValue && typeof docValue.slug === 'string') {
        return `/${docValue.slug}`
      }
      if ('id' in docValue && typeof docValue.id === 'string') {
        return docValue.id
      }
    }
    return '#'
  }

  return node.fields.url ?? '#'
}

export function lexicalToHtml(data: BranchRichText | SerializedEditorState | null | undefined): string {
  if (!data) return ''

  const html = convertLexicalToHTML({
    data: data as SerializedEditorState,
    converters: extendLinkFeature,
  })

  if (html.includes('class="payload-richtext"')) {
    return html.replace('class="payload-richtext"', 'class="payload-richtext entry-content"')
  }

  return `<div class="entry-content">${html}</div>`
}
