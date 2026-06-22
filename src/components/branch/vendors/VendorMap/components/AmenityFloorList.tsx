import type { FloorAmenities } from '@/constants/vendorMapData/index'
import { getAmenityIconClass } from '@/constants/vendorMapData/index'
import type { AmenityId } from '@/constants/vendorMapData/index'

type AmenityFloorListProps = {
  pinColor: string
  amenities: FloorAmenities
  onAmenityMouseEnter?: (amenityId: AmenityId) => void
  onAmenityMouseLeave?: () => void
  onAmenityClick?: (amenityId: AmenityId) => void
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

        return (
          <li
            key={amenity.id}
            className={['amenity-list__item', isSelectable && 'amenity-list__item--selectable']
              .filter(Boolean)
              .join(' ')}
            onMouseEnter={() => {
              if (!onAmenityClick) onAmenityMouseEnter?.(amenity.id)
            }}
            onMouseLeave={() => {
              if (!onAmenityClick) onAmenityMouseLeave?.()
            }}
            onClick={() => {
              if (isSelectable) onAmenityClick(amenity.id)
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
