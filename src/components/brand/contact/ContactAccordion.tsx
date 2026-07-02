'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'

import {
  AccordionContainer,
  AccordionItem,
  AccordionPanel,
  AccordionTitle,
} from '@/components/common/accordion'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

export type ContactAccordionColumn = {
  id: string
  title?: string | null
  richText?: SerializedEditorState | null
}

export type ContactAccordionItem =
  | {
      type: 'doubleColumn'
      id: string
      title: string
      columns: ContactAccordionColumn[]
    }
  | {
      type: 'singleColumn'
      id: string
      title: string
      richText?: SerializedEditorState | null
      buttonText?: string | null
      link?: string | null
    }

export type ContactAccordionProps = {
  items: ContactAccordionItem[]
}

export default function ContactAccordion({ items }: ContactAccordionProps) {
  if (!items.length) return null

  return (
    <AccordionContainer toggle>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          itemId={item.id}
          className={item.type === 'doubleColumn' ? 'accordion-double' : 'accordion-single'}
        >
          <AnimateOnScroll triggerClass="fadeIn">
            <AccordionTitle itemId={item.id}>{item.title}</AccordionTitle>
          </AnimateOnScroll>
          <AccordionPanel innerClassName="entry-panel-inner">
            {item.type === 'doubleColumn' ? (
              <div className="accordion-columns">
                {item.columns.map((column) => (
                  <div key={column.id} className="accordion-column">
                    {column.title ? (
                      <p className="accordion-column-title type-d-title type-m-title uppercase letter-spacing-002 weight-medium">
                        {column.title}
                      </p>
                    ) : null}
                    {column.richText ? (
                      <div className="accordion-column-content entry-content">
                        <LexicalToHTML data={column.richText} />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="accordion-single-content">
                {item.richText ? (
                  <div className="accordion-column-content entry-content">
                    <LexicalToHTML data={item.richText} />
                  </div>
                ) : null}
                {item.buttonText && item.link ? (
                  <Link
                    href={item.link}
                    className="button-template"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={
                      {
                        '--button-bg-color': 'var(--color-saladaeng-orange)',
                      } as React.CSSProperties
                    }
                  >
                    <span>
                      <span>{item.buttonText}</span>
                    </span>
                  </Link>
                ) : null}
              </div>
            )}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </AccordionContainer>
  )
}
