import VendorCard from '@/components/branch/components/vendor-card/VendorCard'
import VendorCardMultipleBranch from '@/components/branch/components/vendor-card/VendorCardMultipleBranch'
import WhatsOnCard from '@/components/branch/components/whats-on-card/WhatsOnCard'
import type { MultiBranchVendorInfo } from '@/components/branch/vendors/types'
import type { BranchLandingVendorCard, BranchLandingWhatsOnCard } from '@/payload/queries/branch'

import type { GridCardContext, GridCardVariant } from './types'

export function renderGridCard(
  card: BranchLandingWhatsOnCard | BranchLandingVendorCard,
  variant: GridCardVariant,
  context: GridCardContext,
  multiBranchVendorsByName?: Record<string, MultiBranchVendorInfo>,
) {
  if (variant === 'whats-on') {
    const { bgColor: _bgColor, ...whatsOnCardProps } = card as BranchLandingWhatsOnCard

    return (
      <WhatsOnCard
        {...whatsOnCardProps}
        branchSlug={context.branchSlug || whatsOnCardProps.branches[0]?.slug}
        themeColor={context.themeColor}
        backgroundColor={context.backgroundColor}
      />
    )
  }

  const vendorCard = card as BranchLandingVendorCard
  const multiBranch = multiBranchVendorsByName?.[vendorCard.title]

  if (multiBranch) {
    return (
      <VendorCardMultipleBranch
        branchSlug={context.branchSlug || vendorCard.branches[0]?.slug}
        branches={multiBranch.branches}
        media={multiBranch.media}
        title={vendorCard.title}
        tags={vendorCard.tags}
        location={vendorCard.location}
      />
    )
  }

  return (
    <VendorCard
      branchSlug={context.branchSlug || vendorCard.branches[0]?.slug}
      {...vendorCard}
    />
  )
}
