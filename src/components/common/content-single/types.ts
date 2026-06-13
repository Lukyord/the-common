import type { ReactNode } from 'react'

export type ContentSingleGalleryItem = {
  src: string
  alt: string
}

export type ContentSingleLayoutProps = {
  children?: ReactNode
  backHref: string
  gallery?: {
    items: ContentSingleGalleryItem[]
    bgColor?: string | null
  }
  section?: string
  sectionClassName?: string
}
