import type { ReactNode } from 'react'

export type ContentSingleGalleryItem = {
  src: string
  alt: string
}

export type ContentSingleSocialLink = {
  key: string
  href: string
  icon: string
  label: string
  className?: string
}

export type ContentSingleLayoutProps = {
  children?: ReactNode
  backHref: string
  gallery?: {
    items: ContentSingleGalleryItem[]
    bgColor?: string | null
  }
  socials?: ContentSingleSocialLink[]
  section?: string
  sectionClassName?: string
}
