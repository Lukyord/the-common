import { ContentSingleLayout } from '@/components/common/content-single'
import type { Branch, Vendor } from '@/payload-types'

import VendorSingleContact from './VendorSingleContact'
import VendorSingleIntro from './VendorSingleIntro'
import VendorSingleMoreAt from './VendorSingleMoreAt'
import VendorSingleOpeningHours from './VendorSingleOpeningHours'
import VendorSingleTags from './VendorSingleTags'
import { resolveVendorGallery } from './resolveVendorGallery'
import AnimateOnScroll from '@/components/common/animate-on-scroll'

type VendorSingleProps = {
  vendor: Vendor
  branch: Branch
  backHref: string
}

export default function VendorSingle({ vendor, branch, backHref }: VendorSingleProps) {
  return (
    <ContentSingleLayout
      section="content-single"
      sectionClassName="vendor-single"
      backHref={backHref}
      gallery={{ items: resolveVendorGallery(vendor) }}
    >
      <VendorSingleIntro name={vendor.name} description={vendor.description} />

      <VendorSingleTags tags={vendor.tags} />

      <AnimateOnScroll triggerClass="fadeIn">
        <hr className="divider" />
      </AnimateOnScroll>

      <VendorSingleOpeningHours openingHours={vendor.openingHours} />

      <AnimateOnScroll triggerClass="fadeIn">
        <hr className="divider" />
      </AnimateOnScroll>

      <VendorSingleContact
        tel={vendor.tel}
        floor={vendor.floor}
        lotNumber={vendor.lotNumber}
        floors={branch.floors}
        branchTheme={{
          bgColor: branch.primaryColor,
          primaryColor: branch.bgColor,
        }}
      />

      <AnimateOnScroll triggerClass="fadeIn">
        <hr className="divider" />
      </AnimateOnScroll>

      <VendorSingleMoreAt items={vendor.moreAt} />
    </ContentSingleLayout>
  )
}
