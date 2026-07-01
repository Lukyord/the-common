'use client'

import { ReactNode, useMemo } from 'react'
import type { FancyboxOptions } from '@fancyapps/ui'

import useFancybox from '@/hooks/useFancybox'
import {
  observeFancyboxCloseButton,
  unobserveFancyboxCloseButton,
} from '@/lib/fancybox/positionCloseButton'

type FancyboxGalleryProps = {
  children: ReactNode
  className?: string
  fancyboxClass?: string
}

export default function FancyboxGallery({
  children,
  className,
  fancyboxClass,
}: FancyboxGalleryProps) {
  const fancyboxOptions = useMemo<Partial<FancyboxOptions>>(
    () => ({
      mainClass: fancyboxClass,
      closeButton: true,
      Carousel: {
        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: [],
          },
        },
        Thumbs: {
          showOnStart: false,
        },
      },
      on: {
        ready: (instance) => {
          observeFancyboxCloseButton(instance)
        },
        'Carousel.change': (instance) => {
          observeFancyboxCloseButton(instance)
        },
        destroy: (instance) => {
          unobserveFancyboxCloseButton(instance)
        },
      },
    }),
    [fancyboxClass],
  )

  const [fancyboxRef] = useFancybox(fancyboxOptions)

  return (
    <div ref={fancyboxRef} className={className}>
      {children}
    </div>
  )
}
