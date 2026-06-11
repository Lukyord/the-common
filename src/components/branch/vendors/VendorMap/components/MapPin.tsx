import type { AmenityPin } from '@/constants/vendorMapData/index'
import type { CSSProperties } from 'react'

type MapPinProps = {
  layout: AmenityPin
  color: string
}

export default function MapPin({ layout, color }: MapPinProps) {
  const style = {
    top: layout.top,
    left: layout.left,
  } as CSSProperties

  return (
    <div className="map-pin" style={style}>
      <svg
        width="23"
        height="33"
        viewBox="0 0 23 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M11.5 0C8.45001 0 5.52494 1.28081 3.36827 3.56066C1.2116 5.84052 0 8.93266 0 12.1569C0 18.8745 11.5 33 11.5 33C11.5 33 23 18.8824 23 12.1569C23 8.93266 21.7884 5.84052 19.6317 3.56066C17.4751 1.28081 14.55 0 11.5 0Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
