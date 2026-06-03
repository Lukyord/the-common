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

export const vendorTagSelectOptions = VENDOR_TAGS.map(({ id, text }) => ({
  label: text,
  value: id,
}))
