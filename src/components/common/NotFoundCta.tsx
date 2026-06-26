'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { CSSProperties } from 'react'

import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { getSlugFromPathname } from '@/lib/pathname'

type NotFoundBranch = {
  slug: string
  footerBg: string | null
}

type NotFoundCtaProps = {
  branches: NotFoundBranch[]
}

export default function NotFoundCta({ branches }: NotFoundCtaProps) {
  const slug = getSlugFromPathname(usePathname())
  const branch = branches.find((item) => item.slug === slug)
  const buttonColor = branch?.footerBg ?? 'var(--color-saladaeng-orange)'

  return (
    <AnimateOnScroll triggerClass="fadeIn" className="sc-cta" delay={600}>
      <Link
        href="/"
        className="button-template"
        style={{ '--button-bg-color': buttonColor } as CSSProperties}
      >
        <span>
          <span>BACK TO HOME</span>
        </span>
      </Link>
    </AnimateOnScroll>
  )
}
