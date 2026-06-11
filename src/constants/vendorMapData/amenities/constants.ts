import type { AmenityId } from '../types'

export function getAmenityIconClass(id: AmenityId) {
  return `ic-amen-${id}`
}

export const AMENITY_LABELS: Record<AmenityId, string> = {
  book: 'Book',
  bike: 'Bike parking',
  toilet: 'Toilet',
  recycling: 'Recycling',
  family: 'Family room',
  water: 'Water station',
  'locker-room': 'Locker room',
  music: 'Music room',
  'meeting-room': 'Meeting room',
  'diaper-changing': 'Diaper changing',
  photobooth: 'Photobooth',
  plant: 'Plant corner',
}
