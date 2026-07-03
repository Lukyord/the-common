import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { getBranches } from '@/payload/queries/branch'

import NotFoundCta from './NotFoundCta'
import RenderMedia from './media'
import { MarkdownContent } from './markdown-content'

type NotFoundContentProps = {
  title?: string
  description?: string
  titleId?: string
}

export default async function NotFoundContent({
  title = 'Page not found',
  description = 'The page you requested couldn’t be found.',
  titleId = 'not-found-title',
}: NotFoundContentProps = {}) {
  const branches = (await getBranches()).map((branch) => ({
    slug: branch.slug,
    footerBg: branch.footerBg ?? null,
  }))
  return (
    <main id="main" className="not-found-page">
      <section data-section="not-found" className="header-padding" aria-labelledby={titleId}>
        <div className="sc-inner pc-t-100 pc-b-100 mb-t-50 mb-b-50">
          <div className="container">
            <div className="sc-header">
              <AnimateOnScroll triggerClass="fadeIn" delay={300} className="not-found-illus">
                <RenderMedia src="/designs/not-found-illus.svg" alt="Not Found Illustration" />
              </AnimateOnScroll>

              <AnimateOnScroll delay={450} triggerClass="fadeIn" className="sc-ttl">
                <h1
                  id={titleId}
                  className="type-d-header type-m-headliner-m weight-medium letter-spacing-002"
                >
                  {title}
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll delay={600} className="sc-desc" triggerClass="fadeIn">
                <MarkdownContent as="p" className="type-d-body-s type-m-body-s letter-spacing-002">
                  {description}
                </MarkdownContent>
              </AnimateOnScroll>
            </div>
            <NotFoundCta branches={branches} />
          </div>
        </div>
      </section>
    </main>
  )
}
