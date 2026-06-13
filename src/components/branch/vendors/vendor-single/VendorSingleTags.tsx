import { getVendorTagIconClass, getVendorTagLabel } from '@/constants/vendorTags'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import type { Vendor } from '@/payload-types'

type VendorSingleTagsProps = {
  tags?: Vendor['tags']
}

export default function VendorSingleTags({ tags }: VendorSingleTagsProps) {
  if (!tags?.length) return null

  return (
    <div className="vs-block vs-tags">
      <AnimateOnScroll triggerClass="fadeIn" className="block-ttl">
        <h3 className="type-d-body-xs type-m-body-s letter-spacing-002">WHAT WE OFFER</h3>
      </AnimateOnScroll>
      <AnimateOnScroll triggerClass="fadeIn">
        <ul className="amenity-list__items">
          {tags.map((tag) => (
            <li key={tag} className="amenity-list__item">
              <span className="amenity-list__icon">
                <i className={`ic ${getVendorTagIconClass(tag)}`} aria-hidden />
              </span>
              <span className="amenity-list__name type-d-text-link type-m-body-m letter-spacing-002">
                {getVendorTagLabel(tag)}
              </span>
            </li>
          ))}
        </ul>{' '}
      </AnimateOnScroll>
    </div>
  )
}
