import type { Metadata } from 'next'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import { MarkdownContent } from '@/components/common/markdown-content'
import { generateMeta } from '@/lib/generateMeta'
import { getPrivacyPolicyPayloadData } from '@/payload/queries/privacy-policy'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { privacyPolicy } = await getPrivacyPolicyPayloadData()

  return generateMeta({
    meta: privacyPolicy?.meta,
    fallbackTitle: privacyPolicy?.title || 'Privacy Policy | The Common',
    fallbackDescription: 'Privacy Policy for The Common',
    pathname: '/privacy-policy',
  })
}

export default async function PrivacyPolicyPage() {
  const { privacyPolicy, error } = await getPrivacyPolicyPayloadData()
  const title = privacyPolicy?.title || 'Privacy Policy'
  const richText = privacyPolicy?.richText as SerializedEditorState | null | undefined

  return (
    <main id="main" className="privacy-policy-page">
      <section data-section="privacy-policy" className="header-padding" aria-label={title}>
        <div className="sc-inner pc-t-150 pc-b-75 mb-t-50 mb-b-100">
          <div className="container">
            <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h1"
                inline
                className="type-d-display type-m-display weight-medium letter-spacing-002"
              >
                {title}
              </MarkdownContent>
            </AnimateOnScroll>

            <div className="privacy-policy-content entry-content">
              {error ? (
                <AnimateOnScroll triggerClass="fadeIn">
                  <p className="type-d-body-l type-m-body-r">
                    Privacy policy content could not be loaded.
                  </p>
                </AnimateOnScroll>
              ) : null}

              {richText ? <LexicalToHTML data={richText} /> : !error ? (
                <AnimateOnScroll triggerClass="fadeIn">
                  <p className="type-d-body-l type-m-body-r">
                    No privacy policy content has been published yet.
                  </p>
                </AnimateOnScroll>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
