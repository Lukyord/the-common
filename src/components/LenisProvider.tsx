'use client'

import gsap from 'gsap'
import { ReactLenis, type LenisRef } from 'lenis/react'
import type { PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'

export default function LenisProvider({ children }: PropsWithChildren) {
  const lenisRef = useRef<LenisRef | null>(null)

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}
