import type { Metadata } from 'next'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Link from 'next/link'
import React, { type CSSProperties } from 'react'

import WhatsOnSingleGallery from '@/components/branch/whats-on-single/WhatsOnSingleGallery'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import BackLink from '@/components/common/BackLink'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import { MarkdownContent } from '@/components/common/markdown-content'
import { generateMeta } from '@/lib/generateMeta'
import { getWhatsOnBySlug } from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch, slug } = await params
  const event = await getWhatsOnBySlug(branch, slug)

  return generateMeta({
    meta: event.meta,
    fallbackTitle: event.title,
    fallbackDescription: event.date ? `${event.title} — ${event.date}` : event.title,
  })
}

export default async function EventSinglePage({ params }: Props) {
  const { branch: branchSlug, slug } = await params
  const event = await getWhatsOnBySlug(branchSlug, slug)

  return (
    <main id="main" className="whats-on-single-page">
      <section data-section="whats-on-single">
        <div className="content-container">
          <div className="content-text">
            <AnimateOnScroll triggerClass="fadeIn" className="back-wrapper">
              <BackLink fallbackHref={`/${branchSlug}/whats-on`} className="back">
                <i className="ic ic-arrow-left size-icon-2xs"></i>
                <p className="letter-spacing-002 weight-medium">BACK</p>
              </BackLink>
            </AnimateOnScroll>

            <div className="content-scroll" data-lenis-prevent>
              <div className="sc-header">
                <div className="sc-ttl-tags">
                  <AnimateOnScroll triggerClass="fadeIn" className="sc-ttl">
                    <MarkdownContent
                      as="h1"
                      className="type-d-title type-m-display letter-spacing-002 weight-medium"
                    >
                      {event.title}
                    </MarkdownContent>
                  </AnimateOnScroll>

                  {(event.mainTag || event.subTags.length > 0) && (
                    <AnimateOnScroll triggerClass="fadeIn" className="sc-tags">
                      {event.mainTag && (
                        <Link
                          href={`/whats-on/filter?branch=${branchSlug}&tag=${event.mainTag}`}
                          className="tag main"
                        >
                          <p className="type-d-body-xs type-m-caption letter-spacing-002">
                            {event.mainTag}
                          </p>
                        </Link>
                      )}
                      {event.subTags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/whats-on/filter?branch=${branchSlug}&tag=${tag}`}
                          className="tag sub"
                        >
                          <p className="type-d-body-xs type-m-caption letter-spacing-002">{tag}</p>
                        </Link>
                      ))}
                    </AnimateOnScroll>
                  )}
                </div>

                <div className="sc-info">
                  {event.date && (
                    <>
                      <div className="info-item date">
                        <AnimateOnScroll triggerClass="fadeIn" className="item-ttl">
                          <p className="type-d-body-xs type-m-body-s letter-spacing-002">DATE</p>
                        </AnimateOnScroll>
                        <AnimateOnScroll triggerClass="fadeIn" className="item-content">
                          <p className="type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                            {event.date}
                          </p>
                        </AnimateOnScroll>
                      </div>
                      <div className="divider"></div>
                    </>
                  )}

                  {event.branches.length > 0 && (
                    <>
                      <div className="info-item avialable-branches">
                        <AnimateOnScroll triggerClass="fadeIn" className="item-ttl">
                          <p className="type-d-body-xs type-m-body-s letter-spacing-002">
                            LOCATION
                          </p>
                        </AnimateOnScroll>
                        <div className="branches">
                          {event.branches.map((branch) => (
                            <AnimateOnScroll
                              triggerClass="fadeIn"
                              key={branch.slug}
                              className="branch"
                            >
                              <span
                                className="branch-location"
                                style={{
                                  backgroundColor: branch.bgColor ?? undefined,
                                  color: branch.color ?? undefined,
                                }}
                              >
                                {branch.location}
                              </span>
                              <p className="type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                                {branch.name}
                              </p>
                            </AnimateOnScroll>
                          ))}
                        </div>
                      </div>
                      <div className="divider"></div>
                    </>
                  )}

                  {event.time && (
                    <>
                      <div className="info-item time">
                        <AnimateOnScroll triggerClass="fadeIn" className="item-ttl">
                          <p className="type-d-body-xs type-m-body-s letter-spacing-002">TIME</p>
                        </AnimateOnScroll>

                        <AnimateOnScroll triggerClass="fadeIn" className="item-content">
                          <p className="type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                            {event.time}
                          </p>
                        </AnimateOnScroll>
                      </div>
                      <div className="divider"></div>
                    </>
                  )}
                </div>
              </div>

              {event.content && (
                <AnimateOnScroll triggerClass="fadeIn" className="sc-content entry-content">
                  <LexicalToHTML data={event.content as SerializedEditorState} />
                </AnimateOnScroll>
              )}

              {event.buttonText && event.buttonLink && (
                <div className="sc-cta">
                  <Link
                    href={event.buttonLink}
                    className="button-template"
                    style={{ '--button-bg-color': event.buttonColor } as CSSProperties}
                  >
                    <span>
                      <span>{event.buttonText}</span>
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <WhatsOnSingleGallery items={event.gallery} bgColor={event.bgColor} />
        </div>
      </section>
    </main>
  )
}
