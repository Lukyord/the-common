import type { FloorAmenities } from '../../types'

export const cloud111FloorAmenities: FloorAmenities = [
  {
    id: 'water',
    label: 'Water Station',
    pins: [{ top: '45%', left: '41%' }],
  },
  {
    id: 'meeting-room',
    key: 'meeting-pods',
    label: 'Meeting Pods',
    pins: [
      { top: '55.5%', left: '52%' },
      {
        top: '54.5%',
        left: '54%',
      },
    ],
  },
  {
    id: 'meeting-room',
    key: 'meeting-room',
    label: 'Meeting room',
    pins: [{ top: '41%', left: '59%' }],
  },
  {
    id: 'locker-room',
    label: 'Lockers',
    pins: [{ top: '59%', left: '50%' }],
  },
]
