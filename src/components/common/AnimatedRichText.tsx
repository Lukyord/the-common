'use client'

import {
  Fragment,
  type CSSProperties,
  type ReactNode,
  createElement,
  useEffect,
  useMemo,
  useState,
} from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'

type AnimatedRichTextProps = {
  html: string
  skipTags?: string[]
  triggerClass?: string | string[]
  animateClassName?: string
  fallbackClassName?: string
  enableAnimation?: boolean
}

type ParsedNode = {
  key: string
  node: ReactNode
  tagName?: string
}

const DEFAULT_SKIP_TAGS = ['ul', 'ol']
const UNWRAP_ROOT_CLASSES = ['entry-content', 'payload-richtext']

function unwrapRootNodes(nodes: ChildNode[]): ChildNode[] {
  if (nodes.length !== 1 || nodes[0].nodeType !== Node.ELEMENT_NODE) {
    return nodes
  }

  const element = nodes[0] as HTMLElement
  if (element.tagName.toLowerCase() !== 'div') {
    return nodes
  }

  const shouldUnwrap = UNWRAP_ROOT_CLASSES.some((className) =>
    element.classList.contains(className),
  )

  if (!shouldUnwrap) {
    return nodes
  }

  return unwrapRootNodes(Array.from(element.childNodes))
}

export default function AnimatedRichText({
  html,
  skipTags = DEFAULT_SKIP_TAGS,
  triggerClass = 'fadeIn',
  animateClassName = 'entry-fade',
  fallbackClassName,
  enableAnimation = true,
}: AnimatedRichTextProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const skipTagSet = useMemo(() => new Set(skipTags.map((tag) => tag.toLowerCase())), [skipTags])

  const parsedNodes = useMemo<ParsedNode[]>(() => {
    if (!isMounted || typeof window === 'undefined' || typeof DOMParser === 'undefined') return []

    const parseStyle = (styleValue: string): CSSProperties => {
      return styleValue.split(';').reduce<CSSProperties>((styleObject, styleEntry) => {
        const [property, ...valueParts] = styleEntry.split(':')
        if (!property || valueParts.length === 0) return styleObject

        const camelCaseProperty = property
          .trim()
          .replace(/-([a-z])/g, (_, character: string) => character.toUpperCase())
        const value = valueParts.join(':').trim()

        if (!value) return styleObject
        ;(styleObject as Record<string, string>)[camelCaseProperty] = value
        return styleObject
      }, {})
    }

    const nodeToReact = (node: ChildNode, key: string): ParsedNode | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? ''
        return text.trim() ? { key, node: text } : null
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return null

      const element = node as HTMLElement
      const tagName = element.tagName.toLowerCase()
      const props: Record<string, unknown> = { key }

      for (const attribute of Array.from(element.attributes)) {
        if (attribute.name === 'class') {
          props.className = attribute.value
          continue
        }

        if (attribute.name === 'style') {
          props.style = parseStyle(attribute.value)
          continue
        }

        props[attribute.name] = attribute.value
      }

      const children = Array.from(element.childNodes)
        .map((childNode, index) => nodeToReact(childNode, `${key}-${index}`))
        .filter((item): item is ParsedNode => item !== null)
        .map((item) => item.node)

      return {
        key,
        tagName,
        node: createElement(tagName, props, children.length > 0 ? children : undefined),
      }
    }

    const parser = new DOMParser()
    const documentNode = parser.parseFromString(html, 'text/html')
    const rootNodes = unwrapRootNodes(Array.from(documentNode.body.childNodes))

    return rootNodes
      .map((node, index) => nodeToReact(node, `richtext-${index}`))
      .filter((item): item is ParsedNode => item !== null)
  }, [html, isMounted])

  if (!isMounted || parsedNodes.length === 0) {
    return <div className={fallbackClassName} dangerouslySetInnerHTML={{ __html: html }} />
  }

  if (!enableAnimation) {
    return <>{parsedNodes.map((item) => <Fragment key={item.key}>{item.node}</Fragment>)}</>
  }

  return (
    <>
      {parsedNodes.map((item) =>
        item.tagName && skipTagSet.has(item.tagName) ? (
          <Fragment key={item.key}>{item.node}</Fragment>
        ) : (
          <AnimateOnScroll key={item.key} triggerClass={triggerClass} className={animateClassName}>
            {item.node}
          </AnimateOnScroll>
        ),
      )}
    </>
  )
}
