export type VenueAmenityIcon = {
  id: string
  text: string
  iconClass: string
}

export const VENUE_AMENITY_ICONS = [
  { id: 'wifi', text: 'Wi-Fi', iconClass: 'ic-wifi' },
  { id: 'tv', text: 'TV', iconClass: 'ic-tv' },
  { id: 'microphone', text: 'Microphone', iconClass: 'ic-microphone' },
  { id: 'white-board', text: 'White Board', iconClass: 'ic-white-board' },
  { id: 'bluetooth-speaker', text: 'Bluetooth Speaker', iconClass: 'ic-bluetooth-speaker' },
  { id: 'sound-proof-panel', text: 'Sound Proof Panel', iconClass: 'ic-sound-proof-panel' },
  { id: 'ac', text: 'Air Conditioning', iconClass: 'ic-ac' },
  { id: 'fans', text: 'Fans', iconClass: 'ic-fans' },
  { id: 'power-outlet', text: 'Power Outlet', iconClass: 'ic-power-outlet' },
  { id: 'parking', text: 'Parking', iconClass: 'ic-parking' },
  { id: 'coffee-machine', text: 'Coffee Machine', iconClass: 'ic-coffee-machine' },
  { id: 'microwave', text: 'Microwave', iconClass: 'ic-microwave' },
  { id: 'utensil', text: 'Utensil', iconClass: 'ic-utensil' },
  { id: 'mixer', text: 'Mixer', iconClass: 'ic-mixer' },
  { id: 'bakery', text: 'Bakery', iconClass: 'ic-bakery' },
  { id: 'fridge', text: 'Fridge', iconClass: 'ic-fridge' },
  { id: 'oven', text: 'Oven', iconClass: 'ic-oven' },
  { id: 'mats', text: 'Mats', iconClass: 'ic-mats' },
  { id: 'foldable-table', text: 'Foldable Table', iconClass: 'ic-foldable-table' },
  { id: 'stool', text: 'Stool', iconClass: 'ic-stool' },
  { id: 'camping-chair', text: 'Camping Chair', iconClass: 'ic-camping-chair' },
  { id: 'calendar', text: 'Calendar', iconClass: 'ic-calendar' },
  { id: 'clock', text: 'Clock', iconClass: 'ic-clock' },
  { id: 'phone', text: 'Phone', iconClass: 'ic-phone' },
] as const satisfies readonly VenueAmenityIcon[]

export type VenueAmenityIconId = (typeof VENUE_AMENITY_ICONS)[number]['id']

const VENUE_AMENITY_ICON_CLASSES: Record<VenueAmenityIconId, string> = Object.fromEntries(
  VENUE_AMENITY_ICONS.map(({ id, iconClass }) => [id, iconClass]),
) as Record<VenueAmenityIconId, string>

export const venueAmenityIconSelectOptions = VENUE_AMENITY_ICONS.map(({ id, text }) => ({
  label: text,
  value: id,
}))

export function getVenueAmenityIconLabel(id: string) {
  return VENUE_AMENITY_ICONS.find((icon) => icon.id === id)?.text ?? id
}

export function getVenueAmenityIconClass(id: string) {
  return VENUE_AMENITY_ICON_CLASSES[id as VenueAmenityIconId] ?? 'ic-wifi'
}
