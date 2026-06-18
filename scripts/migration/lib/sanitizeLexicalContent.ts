import { normalizeLegacyHref } from './normalizeLegacyHref.js'

type LexicalNode = {
  type?: string
  children?: LexicalNode[]
  fields?: Record<string, unknown>
  [key: string]: unknown
}

type LexicalContent = {
  root?: LexicalNode
  [key: string]: unknown
}

function cleanLexicalNodes(nodes: LexicalNode[]): LexicalNode[] {
  return nodes.flatMap((node) => {
    if (node.type === 'upload') return []

    if (node.type === 'link' || node.type === 'autolink') {
      const url = typeof node.fields?.url === 'string' ? node.fields.url : null
      const normalized = url ? normalizeLegacyHref(url) : null
      const children = cleanLexicalNodes(node.children ?? [])

      if (!normalized) return children

      return [
        {
          ...node,
          fields: { ...node.fields, url: normalized },
          children,
        },
      ]
    }

    if (Array.isArray(node.children) && node.children.length) {
      return [{ ...node, children: cleanLexicalNodes(node.children) }]
    }

    return [node]
  })
}

export function sanitizeLexicalContent<T extends LexicalContent | null | undefined>(content: T): T {
  if (!content?.root?.children?.length) return content

  return {
    ...content,
    root: {
      ...content.root,
      children: cleanLexicalNodes(content.root.children),
    },
  }
}
