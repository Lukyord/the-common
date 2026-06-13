export type VendorTag = {
  id: string
  text: string
}

export const VENDOR_TAGS = [
  { id: 'vegan-option', text: 'Vegan Option' },
  { id: 'dairy-free-option', text: 'Dairy-Free Option' },
  { id: 'vegetarian-option', text: 'Vegetarian Option' },
  { id: 'halal-friendly', text: 'Halal-Friendly' },
  { id: 'party-size', text: 'Party-Size' },
  { id: 'only-at-the-commons', text: 'Only at theCOMMONS' },
] as const satisfies readonly VendorTag[]

export type VendorTagId = (typeof VENDOR_TAGS)[number]['id']

const VENDOR_TAG_ICON_CLASSES: Record<VendorTagId, string> = {
  'vegan-option': 'ic-offer-vegan',
  'dairy-free-option': 'ic-offer-diary-free',
  'vegetarian-option': 'ic-offer-nut',
  'halal-friendly': 'ic-offer-halal',
  'party-size': 'ic-offer-party-size',
  'only-at-the-commons': 'ic-offer-only-common',
}

export const vendorTagSelectOptions = VENDOR_TAGS.map(({ id, text }) => ({
  label: text,
  value: id,
}))

export function getVendorTagLabel(id: string) {
  return VENDOR_TAGS.find((tag) => tag.id === id)?.text ?? id
}

export function getVendorTagIconClass(id: string) {
  return VENDOR_TAG_ICON_CLASSES[id as VendorTagId] ?? 'ic-offer-vegan'
}
