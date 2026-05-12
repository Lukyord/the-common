'use client'

import React, { useRef, useEffect, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

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
    triggerClass = 'animate-in',
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
            target.style.visibility = 'visible'
            addClasses(target, triggerClass)
            callback?.()
        }

        const hideElement = (target: HTMLElement, callback?: () => void) => {
            if (!once) {
                target.style.visibility = 'hidden'
                removeClasses(target, triggerClass)
            }
            callback?.()
        }

        // Initial setup
        element.style.visibility = 'hidden'
        element.classList.add('animate')

        const scrollTrigger = ScrollTrigger.create({
            trigger: element,
            start,
            toggleActions,
            onEnter: () => {
                if (delay) {
                    setTimeout(() => showElement(element, onEnter), delay)
                } else {
                    showElement(element, onEnter)
                }
            },
            onLeave: () => {
                hideElement(element, onLeave)
            },
            onEnterBack: () => {
                if (!once) {
                    if (delay) {
                        setTimeout(() => showElement(element), delay)
                    } else {
                        showElement(element)
                    }
                }
                onEnterBack?.()
            },
            onLeaveBack: () => {
                hideElement(element, onLeaveBack)
            },
        })

        // Cleanup function
        return () => {
            scrollTrigger.kill()
        }
    }, [
        triggerClass,
        start,
        toggleActions,
        once,
        delay,
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack,
    ])

    return (
        <div ref={elementRef} className={className} {...rest}>
            {children}
        </div>
    )
}
