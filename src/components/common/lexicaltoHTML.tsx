'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type { HTMLConvertersFunction } from '@payloadcms/richtext-lexical/html'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import React from 'react'

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

export const LexicalToHTML = ({ data }: { data: SerializedEditorState }) => {
    const html = convertLexicalToHTML({ data, converters: extendLinkFeature })

    // Add entry-content class to the root div if it exists, otherwise wrap it
    let processedHtml = html
    if (html.includes('class="payload-richtext"')) {
        // Add entry-content to the existing payload-richtext div
        processedHtml = html.replace(
            'class="payload-richtext"',
            'class="payload-richtext entry-content"',
        )
    } else {
        // Wrap in a div with entry-content class
        processedHtml = `<div class="entry-content">${html}</div>`
    }

    return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
}
