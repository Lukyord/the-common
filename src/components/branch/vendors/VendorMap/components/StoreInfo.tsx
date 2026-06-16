import Link from 'next/link'
import type { CSSProperties } from 'react'

import { HtmlContent } from '@/components/common/html-content'
import type { VendorMapListItem } from '@/components/branch/vendors/types'
import Image from 'next/image'

type StoreInfoProps = {
  vendor: VendorMapListItem
  className: string
  style?: CSSProperties
}

export default function StoreInfo({ vendor, className, style }: StoreInfoProps) {
  return (
    <div className={className} style={style}>
      <Link href={vendor.link} className="link-overlay" aria-label={vendor.name}>
        &nbsp;
      </Link>
      <div className="store-media">
        <figure className="object-fit">
          {vendor.media?.src && (
            <Image
              src={vendor.media.src}
              alt={vendor.media.alt ?? ''}
              loading="eager"
              decoding="async"
            />
          )}
        </figure>
      </div>
      <div className="store-content">
        <div className="content-header">
          <div className="counter type-d-body-l type-m-body-m weight-medium letter-spacing-002">
            {String(vendor.lotNumber).padStart(2, '0')}
          </div>
          <Link href={vendor.link} className="icon" aria-label={vendor.name}>
            <i className="ic ic-arrow-square-top-right size-icon-xs"></i>
          </Link>
        </div>

        <div className="content-text">
          <div className="content-header">
            <h3 className="type-d-body-m type-m-body-m weight-medium letter-spacing-002">
              {vendor.name}
            </h3>
          </div>
          <HtmlContent className="opening-hours">{vendor.openingHoursHtml}</HtmlContent>
        </div>
      </div>
    </div>
  )
}
