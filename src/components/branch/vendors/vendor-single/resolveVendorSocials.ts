import { toExternalHref } from '@/components/footer/footer-utils'
import type { ContentSingleSocialLink } from '@/components/common/content-single'
import type { Vendor } from '@/payload-types'

type VendorSocialConfig = {
  key: keyof NonNullable<Vendor['social']>
  icon: string
  label: string
  className?: string
}

const VENDOR_SOCIALS: VendorSocialConfig[] = [
  { key: 'facebook', icon: 'ic-facebook', label: 'Facebook' },
  { key: 'instagram', icon: 'ic-instagram', label: 'Instagram' },
  { key: 'grab', icon: 'ic-grab', label: 'Grab', className: 'padded-white grab' },
  { key: 'website', icon: 'ic-copy', label: 'Website', className: 'padded-white website' },
]

export function resolveVendorSocials(social?: Vendor['social']): ContentSingleSocialLink[] {
  return VENDOR_SOCIALS.flatMap(({ key, icon, label, className }) => {
    const href = toExternalHref(social?.[key])
    if (!href) return []
    return [{ key, href, icon, label, className }]
  })
}
