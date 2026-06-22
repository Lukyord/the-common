import type { FloorAmenities } from '../../types'

export const thonglorMFloorAmenities: FloorAmenities = [
  {
    id: 'toilet',
    label: 'Toilet',
    pins: [
      {
        top: '23%',
        left: '33%',
      },
    ],
  },
  {
    id: 'water',
    label: 'Water Station',
    pins: [{ top: '45%', left: '43%' }],
  },
  {
    id: 'music',
    label: 'DJ/Live Music',
    pins: [{ top: '45%', left: '39%' }],
  },
  {
    id: 'recycling',
    label: 'Recycling',
    pins: [{ top: '62%', left: '54%' }],
  },
  {
    id: 'bike',
    label: 'Bike parking',
    pins: [{ top: '80%', left: '65%' }],
  },
  {
    id: 'pet-toilet',
    label: 'Pet toilet',
    pins: [{ top: '64%', left: '74%' }],
  },
]
