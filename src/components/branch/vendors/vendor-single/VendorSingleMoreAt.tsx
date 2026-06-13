import Link from 'next/link'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import type { Vendor } from '@/payload-types'

type VendorSingleMoreAtProps = {
  items?: Vendor['moreAt']
}

export default function VendorSingleMoreAt({ items }: VendorSingleMoreAtProps) {
  const links = items?.flatMap((item) => {
    if (!item?.text?.trim() || !item?.link?.trim()) return []
    return [{ text: item.text.trim(), link: item.link.trim() }]
  })

  if (!links?.length) return null

  return (
    <div className="vs-block vs-more-at">
      <AnimateOnScroll triggerClass="fadeIn" className="block-ttl">
        <h3 className="type-d-body-xs type-m-body-s letter-spacing-002">MORE AT:</h3>
      </AnimateOnScroll>
      <AnimateOnScroll triggerClass="fadeIn">
        <ul className="vs-more-at__links">
          {links.map((item, index) => (
            <li key={`${item.text}-${item.link}`}>
              <Link
                href={item.link}
                className="vs-more-at__link type-d-text-link type-m-body-s letter-spacing-002 weight-medium"
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {item.text}
              </Link>
              {index < links.length - 1 && <span>, </span>}
            </li>
          ))}
        </ul>
      </AnimateOnScroll>
    </div>
  )
}
