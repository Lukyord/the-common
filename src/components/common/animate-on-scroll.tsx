'use client'

import React, { useRef, useEffect, ReactNode } from 'react'
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

  // Helper function to add classes
  const addClasses = (element: HTMLElement, classes: string | string[]) => {
    if (Array.isArray(classes)) {
      classes.forEach((cls) => element.classList.add(cls))
    } else {
      element.classList.add(classes)
    }
  }

  // Helper function to remove classes
  const removeClasses = (element: HTMLElement, classes: string | string[]) => {
    if (Array.isArray(classes)) {
      classes.forEach((cls) => element.classList.remove(cls))
    } else {
      element.classList.remove(classes)
    }
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const showElement = (target: HTMLElement, callback?: () => void) => {
      target.classList.remove(PENDING_CLASS)
      addClasses(target, triggerClass)
      callback?.()
    }

    const hideElement = (target: HTMLElement, callback?: () => void) => {
      if (!once) {
        target.classList.add(PENDING_CLASS)
        removeClasses(target, triggerClass)
      }
      callback?.()
    }

    const runShow = () => {
      if (delay) {
        setTimeout(() => showElement(element, onEnter), delay)
      } else {
        showElement(element, onEnter)
      }
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start,
      toggleActions,
      onEnter: runShow,
      onLeave: () => {
        hideElement(element, onLeave)
      },
      onEnterBack: () => {
        if (!once) {
          runShow()
        }
        onEnterBack?.()
      },
      onLeaveBack: () => {
        hideElement(element, onLeaveBack)
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

  const rootClassName = [PENDING_CLASS, 'animate', className].filter(Boolean).join(' ')

  return (
    <div ref={elementRef} className={rootClassName} {...rest}>
      {children}
    </div>
  )
}
