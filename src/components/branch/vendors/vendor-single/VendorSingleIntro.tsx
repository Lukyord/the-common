import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { LexicalToHTML } from '@/components/common/lexicaltoHTML'
import { MarkdownContent } from '@/components/common/markdown-content'
import type { Vendor } from '@/payload-types'

type VendorSingleIntroProps = {
  name: string
  description?: Vendor['description']
}

export default function VendorSingleIntro({ name, description }: VendorSingleIntroProps) {
  return (
    <div className="vs-block vs-intro">
      <AnimateOnScroll triggerClass="fadeIn" className="vs-intro__name">
        <MarkdownContent
          as="h1"
          className="type-d-title type-m-title letter-spacing-002 weight-medium"
        >
          {name}
        </MarkdownContent>
      </AnimateOnScroll>

      {description && (
        <div className="vs-intro__desc entry-content">
          <LexicalToHTML data={description as SerializedEditorState} />
        </div>
      )}
    </div>
  )
}
