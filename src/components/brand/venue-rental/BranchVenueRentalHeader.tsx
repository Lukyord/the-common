import Link from 'next/link'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'
import { resolveMedia } from '@/lib/resolveMedia'
import type { BranchVenueRentalPage } from '@/payload-types'
import { MarkdownContent } from '@/components/common/markdown-content'

type ResolvedMedia = NonNullable<ReturnType<typeof resolveMedia>>

type BranchVenueRentalHeaderData = Pick<
  BranchVenueRentalPage,
  'title' | 'landingMedia' | 'venuePackage'
> & {
  branchName?: string | null
}

export type BranchVenueRentalHeaderProps = {
  title?: string
  branchName?: string
  desktopMedia?: ResolvedMedia
  mobileMedia?: ResolvedMedia
  packageHref?: string | null
  packageDownload?: boolean
  packageExternal?: boolean
}

type VenuePackageAction = {
  href: string
  download: boolean
  external: boolean
  label: string
}

function resolveVenuePackageAction(
  venuePackage?: BranchVenueRentalPage['venuePackage'] | null,
): VenuePackageAction | null {
  if (!venuePackage) return null

  if (venuePackage.type === 'pdf') {
    const pdf = resolveMedia(venuePackage.pdf)
    if (!pdf?.src) return null

    return {
      href: pdf.src,
      download: true,
      external: false,
      label: 'VENUE PACKAGE',
    }
  }

  const link = venuePackage.link?.trim()
  if (!link) return null

  return {
    href: link,
    download: false,
    external: true,
    label: 'VENUE PACKAGE',
  }
}

export function toBranchVenueRentalHeaderProps(
  data?: BranchVenueRentalHeaderData | null,
): BranchVenueRentalHeaderProps {
  const packageAction = resolveVenuePackageAction(data?.venuePackage)

  return {
    title:
      data?.title?.trim() ||
      (data?.branchName?.trim() ? `${data.branchName.trim()} VENUE RENTAL` : 'VENUE RENTAL'),
    branchName: data?.branchName?.trim() || undefined,
    desktopMedia: resolveMedia(data?.landingMedia?.desktop),
    mobileMedia: resolveMedia(data?.landingMedia?.mobile),
    packageHref: packageAction?.href ?? null,
    packageDownload: packageAction?.download ?? false,
    packageExternal: packageAction?.external ?? false,
  }
}

export default function BranchVenueRentalHeader({
  title,
  branchName,
  desktopMedia,
  mobileMedia,
  packageHref,
  packageDownload = false,
  packageExternal = false,
}: BranchVenueRentalHeaderProps) {
  return (
    <div className="branch-venue-rental-header bg-dark-brown">
      {desktopMedia?.src && (
        <AnimateOnScroll triggerClass="fadeIn" className="cover">
          <RenderMedia
            src={desktopMedia.src}
            srcMobile={mobileMedia?.src}
            alt={desktopMedia.alt || branchName || 'Venue rental'}
            priority
          />
        </AnimateOnScroll>
      )}

      <AnimateOnScroll
        triggerClass="fadeEntry"
        delay={500}
        className="branch-venue-rental-header__content"
      >
        <div className="branch-venue-rental-header__title">
          <MarkdownContent
            as="h1"
            className="type-d-display type-m-display weight-medium letter-spacing-002 uppercase"
          >
            {title}
          </MarkdownContent>
        </div>

        {packageHref && (
          <Link
            href={packageHref}
            className="branch-venue-rental-header__package"
            {...(packageDownload ? { download: true } : {})}
            {...(packageExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className="type-d-body-l type-m-body-m weight-medium letter-spacing-002 uppercase">
              VENUE PACKAGE
            </span>
            <i
              className={`ic ${packageExternal ? 'ic-arrow-square-top-right' : 'ic-download'}`}
              aria-hidden
            />
          </Link>
        )}
      </AnimateOnScroll>
    </div>
  )
}
