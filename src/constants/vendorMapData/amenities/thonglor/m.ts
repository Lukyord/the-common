import type { FloorAmenities } from '../../types'

export const thonglorMFloorAmenities: FloorAmenities = [
  {
    id: 'toilet',
    label: 'Toilet',
    pins: [
      { top: '35%', left: '25%' },
      { top: '62%', left: '48%' },
    ],
  },
  {
    id: 'water',
    label: 'Water station',
    pins: [{ top: '40%', left: '55%' }],
  },
  {
    id: 'recycling',
    label: 'Recycling',
    pins: [{ top: '28%', left: '70%' }],
  },
  {
    id: 'bike',
    label: 'Bike parking',
    pins: [{ top: '75%', left: '15%' }],
  },
]
