import { generateMeta } from '@/lib/generateMeta'
import {
  getBranchBySlug,
  getBranchLandingVendors,
  getBranchLandingWhatsOn,
} from '@/payload/queries/branch'
import type { Metadata } from 'next'
import { getHomepageMottoData } from '@/payload/queries/home'
import { resolveMedia } from '@/lib/resolveMedia'
import RenderMedia from '@/components/common/media'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { MarkdownContent } from '@/components/common/markdown-content'
import { MottoMarquee } from '@/components/elements/MottoMarquee'
import AboutSection from '@/components/branch/landing/AboutSection'
import BranchVendorsSection from '@/components/branch/landing/BranchVendorsSection'
import BranchWhatsOnSection from '@/components/branch/landing/BranchWhatsOnSection'
import VibeSection from '@/components/branch/landing/VibeSection'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { branch: slug } = await params
  const branch = await getBranchBySlug(slug)

  return generateMeta({
    meta: branch.meta,
    fallbackTitle: branch.hero?.title || branch.name,
    fallbackDescription: branch.name ? `${branch.name} | The Common` : 'The Common',
    pathname: `/${slug}`,
  })
}

export default async function BranchPage({ params }: Props) {
  const { branch: slug } = await params
  const [branch, homepageMotto] = await Promise.all([getBranchBySlug(slug), getHomepageMottoData()])
  const [vendorCards, whatsOnCards] = await Promise.all([
    getBranchLandingVendors(branch),
    getBranchLandingWhatsOn(branch),
  ])
  const heroBackground = resolveMedia(branch?.hero?.backgroundMedia)
  const heroBackgroundMobile = resolveMedia(branch?.hero?.mobileBackgroundMedia)

  return (
    <main id="main" className="branch-page">
      <section data-section="page-hero" data-branch-slug={branch?.slug}>
        {heroBackground?.src && (
          <div className="cover">
            <RenderMedia
              src={heroBackground.src}
              srcMobile={heroBackgroundMobile?.src || heroBackground.src}
              alt={heroBackground.alt}
              priority
            />
          </div>
        )}
        <div className="sc-inner pc-t-100 pc-b-75 mb-t-100 mb-b-75">
          <div className="container">
            <AnimateOnScroll delay={300} triggerClass="fadeIn" className="sc-ttl">
              <MarkdownContent
                as="h1"
                inline
                className="type-d-display type-m-display weight-medium"
              >
                {branch?.hero?.title || branch?.name}
              </MarkdownContent>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <MottoMarquee items={homepageMotto?.motto} />

      <AboutSection data={branch?.about} branchSlug={branch?.slug} />

      <VibeSection data={branch?.vibesCheck} />

      <BranchVendorsSection
        title={branch?.vendorsSection?.title}
        branchSlug={branch?.slug}
        buttonColor={branch.footerBg}
        cards={vendorCards}
      />

      <BranchWhatsOnSection
        themeColor={{
          bgColor: branch?.bgColor,
          color: branch?.primaryColor,
        }}
        title={branch?.whatsOnSection?.title}
        branchSlug={branch?.slug}
        buttonColor={branch.footerBg}
        cards={whatsOnCards}
      />
    </main>
  )
}
