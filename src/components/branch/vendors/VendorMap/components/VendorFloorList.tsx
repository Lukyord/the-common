'use client'

import Link from 'next/link'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { MapVendor } from '@/constants/vendorMapData/index'
import type { VendorMapListItem } from '@/components/branch/vendors/types'

import { buildFloorVendorList, splitVendorsIntoSlides } from '../lib/utils'

import 'swiper/css'
import 'swiper/css/pagination'

type VendorFloorListProps = {
  floorId: string
  mapVendors: MapVendor[]
  cmsVendors: VendorMapListItem[]
  onVendorMouseEnter?: (lotNumber: number) => void
  onVendorClick?: (lotNumber: number) => void
}

function VendorListSlide({
  vendors,
  onVendorMouseEnter,
  onVendorClick,
}: {
  vendors: ReturnType<typeof buildFloorVendorList>
  onVendorMouseEnter?: (lotNumber: number) => void
  onVendorClick?: (lotNumber: number) => void
}) {
  return (
    <ul className="vendor-list__items">
      {vendors.map((vendor) => {
        const isSelectable = Boolean(onVendorClick && vendor.name)

        return (
          <li
            key={vendor.lotNumber}
            className={[
              'vendor-list__item',
              isSelectable && 'vendor-list__item--selectable',
            ]
              .filter(Boolean)
              .join(' ')}
            onMouseEnter={() => {
              if (!onVendorClick && vendor.name) onVendorMouseEnter?.(vendor.lotNumber)
            }}
            onClick={() => {
              if (isSelectable) onVendorClick(vendor.lotNumber)
            }}
          >
            <span className="vendor-list__counter type-d-body-xs type-m-body-s letter-spacing-002">
              {String(vendor.lotNumber).padStart(2, '0')}
            </span>
            {vendor.name && !onVendorClick && vendor.link ? (
              <Link
                href={vendor.link}
                className="vendor-list__name type-d-label type-m-body-s letter-spacing-002 weight-medium"
              >
                {vendor.name}
              </Link>
            ) : vendor.name ? (
              <span className="vendor-list__name type-d-label type-m-body-s letter-spacing-002 weight-medium">
                {vendor.name}
              </span>
            ) : (
              <span className="vendor-list__name vendor-list__name--empty type-d-label type-m-body-s weight-medium letter-spacing-002">
                —
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function VendorFloorList({
  floorId,
  mapVendors,
  cmsVendors,
  onVendorMouseEnter,
  onVendorClick,
}: VendorFloorListProps) {
  if (!mapVendors.length) return null

  const vendors = buildFloorVendorList(mapVendors, cmsVendors, floorId)
  const [firstSlide, secondSlide] = splitVendorsIntoSlides(vendors)
  const slides = [firstSlide, secondSlide].filter((slide) => slide.length > 0)

  if (!slides.length) return null

  return (
    <div className="card-container" data-card-layout="slider">
      <Swiper
        key={floorId}
        className="vendor-list__swiper dark-bg"
        modules={[Pagination]}
        pagination={{ clickable: true }}
        slidesPerView="auto"
        watchOverflow
        spaceBetween={0}
      >
        {slides.map((slideVendors, index) => (
          <SwiperSlide key={`${floorId}-slide-${index}`}>
            <VendorListSlide
              vendors={slideVendors}
              onVendorMouseEnter={onVendorMouseEnter}
              onVendorClick={onVendorClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
