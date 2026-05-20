'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

import { MOBILE_BREAKPOINT } from '@/utils/utils'

type HorizontalMarqueeProps = {
  children: React.ReactNode
  speed?: number // Duration in seconds (lower = faster)
  direction?: 'left' | 'right'
  /**
   * overflow: animate only when content is wider than the container (default).
   * narrow: same, but only when window width ≤ narrowMaxWidth.
   * always: always animate.
   */
  mode?: 'overflow' | 'narrow' | 'always'
  narrowMaxWidth?: number
}

export default function HorizontalMarquee({
  children,
  speed = 10,
  direction = 'left',
  mode = 'overflow',
  narrowMaxWidth = MOBILE_BREAKPOINT,
}: HorizontalMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [duplicateCount, setDuplicateCount] = useState(mode === 'always' ? 2 : 1)

  useEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current

    if (!container || !wrapper) return

    const updateLayout = () => {
      const segment = wrapper.firstElementChild as HTMLElement | null
      if (!segment) return

      const segmentWidth = segment.offsetWidth
      if (segmentWidth <= 0) return

      const containerWidth = container.clientWidth
      let count = 1

      if (mode === 'always') {
        count = Math.max(2, Math.ceil(containerWidth / segmentWidth) + 2)
      } else {
        const narrowOk = mode === 'narrow' ? window.innerWidth <= narrowMaxWidth : true
        const overflows = segmentWidth > containerWidth
        if (narrowOk && overflows) {
          count = Math.max(2, Math.ceil(containerWidth / segmentWidth) + 2)
        }
      }

      setDuplicateCount(count)
    }

    const rafId = requestAnimationFrame(updateLayout)
    window.addEventListener('resize', updateLayout)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updateLayout)
    }
  }, [mode, narrowMaxWidth, children])

  useEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current

    if (!container || !wrapper || duplicateCount < 2) {
      animationRef.current?.kill()
      animationRef.current = null
      if (wrapper) gsap.set(wrapper, { x: 0 })
      return
    }

    const initAnimation = () => {
      if (!wrapper) return

      const firstChild = wrapper.firstElementChild as HTMLElement
      if (!firstChild) return

      const contentWidth = firstChild.offsetWidth
      const moveDistance = direction === 'left' ? -contentWidth : contentWidth

      gsap.set(wrapper, { x: 0 })

      animationRef.current = gsap.fromTo(
        wrapper,
        { x: 0 },
        {
          x: moveDistance,
          duration: speed,
          ease: 'none',
          repeat: -1,
        },
      )
    }

    const rafId = requestAnimationFrame(() => {
      initAnimation()
    })

    const handleMouseEnter = () => {
      animationRef.current?.pause()
    }

    const handleMouseLeave = () => {
      animationRef.current?.resume()
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(rafId)
      animationRef.current?.kill()
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [speed, direction, duplicateCount])

  return (
    <div
      className="horizontal-marquee"
      ref={containerRef}
      style={{
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <div
        ref={wrapperRef}
        style={{
          display: 'flex',
          width: 'fit-content',
        }}
      >
        {Array.from({ length: duplicateCount }).map((_, index) => (
          <div key={index}>{children}</div>
        ))}
      </div>
    </div>
  )
}
