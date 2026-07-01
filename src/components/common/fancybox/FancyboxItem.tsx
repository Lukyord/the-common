import Link from 'next/link'

import '@fancyapps/ui/dist/fancybox/fancybox.css'
import { Media } from '@/payload-types'

import RenderMedia from '@/components/common/media'

type FancyboxItemProps = {
  className?: string
  image: Media
  index: number
}

export default function FancyboxItem({ className, image, index }: FancyboxItemProps) {
  return (
    <div key={index} className={`${className}`}>
      <Link data-fancybox="gallery" href={(image as Media).url} className="link-overlay">
        &nbsp;
      </Link>
      <RenderMedia src={(image as Media).url} alt={(image as Media).alt} />
    </div>
  )
}
