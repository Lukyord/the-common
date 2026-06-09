import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import type { BranchContactPage, Contact } from '@/payload-types'

type ContactAccordionData = Pick<Contact | BranchContactPage, 'accordion'>

import ContactAccordion, {
  type ContactAccordionItem,
  type ContactAccordionProps,
} from './ContactAccordion'

export function toContactAccordionProps(data?: ContactAccordionData | null): ContactAccordionProps {
  const items: ContactAccordionItem[] = []

  for (const [index, block] of (data?.accordion ?? []).entries()) {
    const id = block.id ?? `contact-accordion-${index}`

    if (block.blockType === 'doubleColumn') {
      const title = block.title?.trim()
      if (!title) continue

      items.push({
        type: 'doubleColumn',
        id,
        title,
        columns: (block.columns ?? []).map((column, columnIndex) => ({
          id: column.id ?? `${id}-column-${columnIndex}`,
          title: column.title,
          richText: column.richText as SerializedEditorState | null | undefined,
        })),
      })
      continue
    }

    if (block.blockType === 'singleColumn') {
      const title = block.title?.trim()
      if (!title) continue

      items.push({
        type: 'singleColumn',
        id,
        title,
        richText: block.richText as SerializedEditorState | null | undefined,
        buttonText: block.buttonText,
        link: block.link,
      })
    }
  }

  return { items }
}

export default function ContactAccordionContainer({ items }: ContactAccordionProps) {
  if (!items.length) return null

  return (
    <section data-section="contact-accordion" className="bg-dark-brown">
      <ContactAccordion items={items} />
    </section>
  )
}
