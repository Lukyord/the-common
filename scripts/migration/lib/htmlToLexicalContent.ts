import { convertHTMLToLexical, lexicalEditor } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { SanitizedConfig } from 'payload'

import type { WhatsOn } from '@/payload-types'
import { normalizeLegacyHtml } from './normalizeLegacyHtml.js'
import { sanitizeLexicalContent } from './sanitizeLexicalContent.js'

const editorConfigStub = {
  i18n: { translations: {} },
} as SanitizedConfig

let editorConfigPromise: ReturnType<typeof loadEditorConfig> | null = null

async function loadEditorConfig() {
  const adapter = lexicalEditor()
  const result = await adapter({
    config: editorConfigStub,
    isRoot: true,
    parentIsLocalized: false,
  })
  return result.editorConfig
}

async function getEditorConfig() {
  editorConfigPromise ??= loadEditorConfig()
  return editorConfigPromise
}

export async function htmlToLexicalContent(
  html: string | null | undefined,
): Promise<WhatsOn['content'] | null> {
  if (!html?.trim()) return null

  const normalizedHtml = normalizeLegacyHtml(html)

  const lexical = convertHTMLToLexical({
    editorConfig: await getEditorConfig(),
    html: normalizedHtml,
    JSDOM,
  }) as WhatsOn['content']

  return sanitizeLexicalContent(lexical)
}
