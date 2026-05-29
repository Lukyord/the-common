'use client'

import React, { useRef, useEffect, useState, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const PENDING_CLASS = 'animate-on-scroll-pending'

type AnimateOnScrollProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'onEnter' | 'onLeave'
> & {
  children: ReactNode
  className?: string
  triggerClass?: string | string[]
  start?: string
  toggleActions?: string
  once?: boolean
  delay?: number
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
}

export default function AnimateOnScroll({
  children,
  className = '',
  triggerClass = 'fadeIn',
  start = 'top bottom',
  toggleActions = 'play none none reverse',
  once = true,
  delay = 0,
  onEnter,
  onLeave,
  onEnterBack,
  onLeaveBack,
  ...rest
}: AnimateOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const showElement = (callback?: () => void) => {
      setIsRevealed(true)
      callback?.()
    }

    const hideElement = (callback?: () => void) => {
      if (!once) {
        setIsRevealed(false)
      }
      callback?.()
    }

    const runShow = () => {
      if (delay) {
        setTimeout(() => showElement(onEnter), delay)
      } else {
        showElement(onEnter)
      }
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start,
      toggleActions,
      onEnter: runShow,
      onLeave: () => {
        hideElement(onLeave)
      },
      onEnterBack: () => {
        if (!once) {
          runShow()
        }
        onEnterBack?.()
      },
      onLeaveBack: () => {
        hideElement(onLeaveBack)
      },
    })

    ScrollTrigger.refresh()
    if (ScrollTrigger.isInViewport(element)) {
      runShow()
    }

    return () => {
      scrollTrigger.kill()
    }
  }, [triggerClass, start, toggleActions, once, delay, onEnter, onLeave, onEnterBack, onLeaveBack])

  const triggerClasses = Array.isArray(triggerClass) ? triggerClass : [triggerClass]
  const rootClassName = [
    !isRevealed && PENDING_CLASS,
    'animate',
    ...(isRevealed ? triggerClasses : []),
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={elementRef} className={rootClassName} {...rest}>
      {children}
    </div>
  )
}
