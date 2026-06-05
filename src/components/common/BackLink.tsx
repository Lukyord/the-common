'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

type BackLinkProps = {
  fallbackHref: string
  className?: string
  children: ReactNode
}

export default function BackLink({ fallbackHref, className, children }: BackLinkProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (window.history.length > 1) {
          router.back()
          return
        }

        router.push(fallbackHref)
      }}
    >
      {children}
    </button>
  )
}
