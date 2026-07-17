import {
  getAmenityEntryKey,
  getAmenityIconClass,
  type FloorAmenities,
} from '@/constants/vendorMapData/index'

type AmenityFloorListProps = {
  pinColor: string
  amenities: FloorAmenities
  onAmenityMouseEnter?: (amenityKey: string) => void
  onAmenityMouseLeave?: () => void
  onAmenityClick?: (amenityKey: string) => void
}

export default function AmenityFloorList({
  pinColor,
  amenities,
  onAmenityMouseEnter,
  onAmenityMouseLeave,
  onAmenityClick,
}: AmenityFloorListProps) {
  if (!amenities.length) return null

  return (
    <ul className="amenity-list__items">
      {amenities.map((amenity) => {
        const isSelectable = Boolean(onAmenityClick)
        const amenityKey = getAmenityEntryKey(amenity)

        return (
          <li
            key={amenityKey}
            className={['amenity-list__item', isSelectable && 'amenity-list__item--selectable']
              .filter(Boolean)
              .join(' ')}
            onMouseEnter={() => {
              if (!onAmenityClick) onAmenityMouseEnter?.(amenityKey)
            }}
            onMouseLeave={() => {
              if (!onAmenityClick) onAmenityMouseLeave?.()
            }}
            onClick={() => {
              if (isSelectable) onAmenityClick(amenityKey)
            }}
            style={
              {
                '--pin-color': pinColor,
              } as React.CSSProperties
            }
          >
            <span className="amenity-list__icon">
              <i className={`ic ${getAmenityIconClass(amenity.id)}`} aria-hidden />
            </span>
            <span className="amenity-list__name type-d-xs type-m-body-s letter-spacing-002">
              {amenity.label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
