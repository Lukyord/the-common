export type VendorTag = {
  id: string
  text: string
}

export const VENDOR_TAGS = [
  { id: 'vegan-option', text: 'Vegan Option' },
  { id: 'spicy', text: 'Spicy' },
  { id: 'kid-friendly', text: 'Kid-Friendly' },
  { id: 'delivery-app', text: 'Delivery app' },
  { id: 'family-size', text: 'Family-Size' },
  { id: 'artisanal', text: 'Artisanal' },
  { id: 'halal-friendly', text: 'Halal-Friendly' },
  { id: 'vegetarian', text: 'Vegetarian' },
  { id: 'quick-bite', text: 'Quick Bite' },
  { id: 'premium-craft', text: 'Premium/Craft' },
  { id: 'only-at-the-commons', text: 'Only at theCOMMONS' },
  { id: 'dairy-free-option', text: 'Dairy-Free Option' },
  { id: 'local-sourced', text: 'Local Sourced' },
] as const satisfies readonly VendorTag[]

export const vendorTagSelectOptions = VENDOR_TAGS.map(({ id, text }) => ({
  label: text,
  value: id,
}))
