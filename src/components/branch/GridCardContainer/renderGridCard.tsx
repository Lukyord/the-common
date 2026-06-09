import VendorCard from '@/components/branch/components/VendorCard'
import WhatsOnCard from '@/components/branch/components/whats-on-card/WhatsOnCard'
import type { BranchLandingVendorCard, BranchLandingWhatsOnCard } from '@/payload/queries/branch'

import type { GridCardContext, GridCardVariant } from './types'

export function renderGridCard(
  card: BranchLandingWhatsOnCard | BranchLandingVendorCard,
  variant: GridCardVariant,
  context: GridCardContext,
) {
  if (variant === 'whats-on') {
    const { bgColor: _bgColor, ...whatsOnCardProps } = card as BranchLandingWhatsOnCard

    return (
      <WhatsOnCard
        {...whatsOnCardProps}
        branchSlug={context.branchSlug}
        themeColor={context.themeColor}
        backgroundColor={context.backgroundColor}
      />
    )
  }

  return <VendorCard branchSlug={context.branchSlug} {...(card as BranchLandingVendorCard)} />
}
