'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, type CSSProperties } from 'react'

import { HtmlContent } from '@/components/common/html-content'
import type { VendorMapListItem } from '@/components/branch/vendors/types'

type StoreInfoProps = {
  vendor: VendorMapListItem
  className: string
  style?: CSSProperties
}

export default function StoreInfo({ vendor, className, style }: StoreInfoProps) {
  const imageSrc = vendor.media?.src
  const [loadedImageSrc, setLoadedImageSrc] = useState<string | null>(null)
  const isImageReady = !imageSrc || loadedImageSrc === imageSrc

  useEffect(() => {
    if (!imageSrc) {
      setLoadedImageSrc(null)
      return
    }

    const img = new window.Image()
    img.src = imageSrc
    setLoadedImageSrc(img.complete ? imageSrc : null)
  }, [imageSrc])

  const rootClassName = [className, vendor.isMapOnlyLot && 'store-info--map-only']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClassName} style={style}>
      <Link href={vendor.link} className="link-overlay" aria-label={vendor.name}>
        &nbsp;
      </Link>
      <div className="store-media">
        <figure className={['object-fit', !isImageReady && 'is-loading'].filter(Boolean).join(' ')}>
          {imageSrc ? (
            <Image
              key={imageSrc}
              src={imageSrc}
              alt={vendor.media?.alt ?? ''}
              loading="eager"
              decoding="async"
              width={100}
              height={100}
              onLoad={() => setLoadedImageSrc(imageSrc)}
            />
          ) : null}
        </figure>
      </div>
      <div className="store-content">
        <div className="content-header">
          {vendor.lotLabel ? (
            <div className="counter type-d-body-l type-m-body-m weight-medium letter-spacing-002">
              {String(vendor.lotNumber).padStart(2, '0')}
            </div>
          ) : (
            <div className="content-header">
              <h3 className="type-d-body-m type-m-body-m weight-medium letter-spacing-002">
                {vendor.name}
              </h3>
            </div>
          )}

          <Link href={vendor.link} className="icon" aria-label={vendor.name}>
            <i className="ic ic-arrow-square-top-right size-icon-2xs"></i>
          </Link>
        </div>

        <div className="content-text">
          {vendor.lotLabel ? (
            <div className="content-header">
              <h3 className="type-d-body-m type-m-body-m weight-medium letter-spacing-002">
                {vendor.name}
              </h3>
            </div>
          ) : null}
          <HtmlContent className="opening-hours">{vendor.openingHoursHtml}</HtmlContent>
        </div>
      </div>
    </div>
  )
}
