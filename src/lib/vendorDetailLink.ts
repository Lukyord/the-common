export function getVendorDetailHref(
  slug: string,
  linkFormat: 'branch' | 'brand',
  branchSlug?: string | null,
) {
  if (linkFormat === 'brand') return `/vendors/${slug}`
  if (!branchSlug) return `/vendors/${slug}`
  return `/${branchSlug}/vendors/${slug}`
}

export function toBrandVendorDetailHref(branchVendorHref: string) {
  const slug = branchVendorHref.split('/vendors/')[1]?.split(/[?#]/)[0]
  return slug ? `/vendors/${slug}` : branchVendorHref
}
