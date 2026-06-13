import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import type { Vendor } from '@/payload-types'

type VendorSingleOpeningHoursProps = {
  openingHours?: Vendor['openingHours']
}

export default function VendorSingleOpeningHours({ openingHours }: VendorSingleOpeningHoursProps) {
  if (!openingHours) return null

  return (
    <div className="vs-block vs-hours opening-hours">
      <AnimateOnScroll triggerClass="fadeIn" className="block-ttl">
        <h3 className="type-d-body-xs type-m-body-s letter-spacing-002">OPENING HOURS</h3>
      </AnimateOnScroll>

      <div className="entry-content">
        <LexicalToHTML data={openingHours as SerializedEditorState} />
      </div>
    </div>
  )
}
