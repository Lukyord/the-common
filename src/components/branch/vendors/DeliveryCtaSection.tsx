import Link from 'next/link'
import React, { type CSSProperties } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import { MarkdownContent } from '@/components/common/markdown-content'
import RenderMedia from '@/components/common/media'
import type { BranchVendorPage, VendorsPage } from '@/payload-types'

type DeliveryCtaSectionProps = {
  data: Pick<
    BranchVendorPage | VendorsPage,
    'backgroundColor' | 'textColor' | 'deliveryTitle' | 'content' | 'grabLink' | 'linemanLink'
  >
}

export default function DeliveryCtaSection({ data }: DeliveryCtaSectionProps) {
  return (
    <section
      data-section="delivery-cta"
      style={
        {
          backgroundColor: data.backgroundColor ?? 'var(--color-thonglor-navy)',
          color: data.textColor ?? 'var(--color-white)',
        } as CSSProperties
      }
    >
      <div className="sc-inner pc-t-50 pc-b-50 mb-t-75 mb-b-75">
        <div className="container">
          <div className="text-content">
            {data.deliveryTitle && (
              <AnimateOnScroll className="sc-ttl">
                <MarkdownContent
                  as="h2"
                  className="type-d-header type-m-headliner-m letter-spacing-002 weight-medium"
                >
                  {data.deliveryTitle}
                </MarkdownContent>
              </AnimateOnScroll>
            )}
            {data.content && (
              <div className="sc-content entry-content">
                <LexicalToHTML data={data.content} />
              </div>
            )}
          </div>
          {data.grabLink && data.linemanLink && (
            <div className="media-cta">
              <div className="bag">
                <RenderMedia src="/designs/paper-bag.webp" alt="Paper Bag" />
              </div>
              <div className="grab">
                <Link href={data.grabLink ?? ''} className="link-overlay">
                  &nbsp;
                </Link>
                <RenderMedia src="/designs/grab.webp" alt="Grab" />
              </div>
              <div className="lineman">
                <Link href={data.linemanLink ?? ''} className="link-overlay">
                  &nbsp;
                </Link>
                <RenderMedia src="/designs/lineman.webp" alt="Lineman" />
              </div>
            </div>
          )}

          {data.grabLink && (
            <div className="media-cta only-grab">
              <div className="bag">
                <RenderMedia src="/designs/paper-bag.webp" alt="Paper Bag" />
              </div>
              <div className="grab">
                <Link
                  href={data.grabLink ?? ''}
                  className="link-overlay"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  &nbsp;
                </Link>
                <RenderMedia src="/designs/grab.webp" alt="Grab" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
