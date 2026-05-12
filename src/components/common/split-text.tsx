'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(SplitText, ScrollTrigger)

const waitForFonts = (element?: HTMLElement | null): Promise<void> => {
    return new Promise((resolve) => {
        // Maximum wait time (2 seconds) to prevent infinite waiting
        const maxWaitTime = 2000
        const startTime = Date.now()

        // If fonts API is not available, wait a bit and resolve
        if (!document.fonts || !document.fonts.ready) {
            setTimeout(resolve, 500)
            return
        }

        // Wait for fonts.ready to resolve
        document.fonts.ready
            .then(() => {
                // If we have an element, check its computed font
                if (element) {
                    const checkElementFont = () => {
                        // Check if we've exceeded max wait time
                        if (Date.now() - startTime > maxWaitTime) {
                            resolve()
                            return
                        }

                        try {
                            const computedStyle = window.getComputedStyle(element)
                            const fontFamily = computedStyle.fontFamily
                            const fontSize = computedStyle.fontSize || '16px'

                            // Extract font names from the font-family string (remove quotes and fallbacks)
                            const fontNames = fontFamily
                                .split(',')
                                .map((f) => f.trim().replace(/['"]/g, ''))
                                .filter(
                                    (f) =>
                                        f &&
                                        f !== 'serif' &&
                                        f !== 'sans-serif' &&
                                        f !== 'cursive' &&
                                        f !== 'monospace',
                                )

                            // Check if at least one font is loaded
                            const fontLoaded =
                                fontNames.length === 0 ||
                                fontNames.some((font) => {
                                    return document.fonts.check(`${fontSize} "${font}"`)
                                })

                            if (fontLoaded) {
                                // Wait for next frame to ensure fonts are fully applied
                                requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                        resolve()
                                    })
                                })
                            } else {
                                // If font not loaded yet, check again (with timeout)
                                setTimeout(checkElementFont, 50)
                            }
                        } catch (_error) {
                            // If there's an error checking, just resolve after a delay
                            setTimeout(resolve, 200)
                        }
                    }

                    // Start checking after a brief delay
                    setTimeout(checkElementFont, 100)
                } else {
                    // No element provided, just wait for fonts.ready and a couple frames
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            resolve()
                        })
                    })
                }
            })
            .catch(() => {
                // If fonts.ready fails, fallback to timeout
                setTimeout(resolve, 500)
            })
    })
}

export type SplitTextAnimationOptions = {
    // Animation type: 'chars' | 'words' | 'lines' | 'chars,words' | 'chars,words,lines'
    type?: string
    // GSAP animation vars (e.g., { opacity: 0, y: 50 })
    from?: gsap.TweenVars
    // GSAP animation vars (e.g., { opacity: 1, y: 0 })
    to?: gsap.TweenVars
    // Stagger delay between elements (in seconds)
    stagger?: number
    // Animation duration (in seconds)
    duration?: number
    // Animation delay (in seconds)
    delay?: number
    // Easing function
    ease?: string
    // Whether to animate on scroll (requires ScrollTrigger)
    animateOnScroll?: boolean
    // ScrollTrigger start position (e.g., 'top 80%')
    scrollStart?: string
    // Whether to run animation once or on enter/leave
    scrollOnce?: boolean
    // Custom SplitText options
    splitOptions?: Record<string, unknown>
}

export const useSplitText = (options: SplitTextAnimationOptions = {}) => {
    const elementRef = useRef<HTMLElement>(null)
    const splitInstanceRef = useRef<SplitText | null>(null)
    const animationRef = useRef<gsap.core.Tween | null>(null)
    const optionsRef = useRef(options)

    // Update options ref when options change
    useEffect(() => {
        optionsRef.current = options
    }, [options])

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        // Get initial opacity from options to prevent flash
        const currentOptions = optionsRef.current
        const initialFrom = currentOptions.from || { opacity: 0, y: 20 }
        const initialOpacity = initialFrom.opacity !== undefined ? initialFrom.opacity : 0

        // Set initial opacity immediately to prevent flash before GSAP loads
        gsap.set(element, { opacity: initialOpacity })

        // Cleanup function
        const cleanup = () => {
            if (animationRef.current) {
                animationRef.current.kill()
                animationRef.current = null
            }
            if (splitInstanceRef.current) {
                splitInstanceRef.current.revert()
                splitInstanceRef.current = null
            }
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.trigger === element) {
                    trigger.kill()
                }
            })
        }

        // Cleanup any existing split before starting
        cleanup()

        const initializeSplitText = async () => {
            // Wait for fonts to load before initializing SplitText
            await waitForFonts(element)

            if (!element) return

            // Double-check cleanup after async wait (in case of race conditions)
            if (splitInstanceRef.current) {
                splitInstanceRef.current.revert()
                splitInstanceRef.current = null
            }

            // Check if element already has split markup (additional safeguard)
            if (element.querySelector('.word, .char, .line')) {
                // Element already split, skip
                return
            }

            const {
                type = 'chars,words',
                from = { opacity: 0, y: 20 },
                to = { opacity: 1, y: 0 },
                stagger = 0.02,
                duration = 0.6,
                delay = 0,
                ease = 'power2.out',
                animateOnScroll = true,
                scrollStart = 'top bottom',
                scrollOnce = true,
                splitOptions = {},
            } = currentOptions

            // Create SplitText instance
            splitInstanceRef.current = new SplitText(element, {
                type,
                charsClass: 'char',
                wordsClass: 'word',
                linesClass: 'line',
                ...splitOptions,
            })

            // Get the elements to animate (chars, words, or lines)
            const elements =
                splitInstanceRef.current.chars ||
                splitInstanceRef.current.words ||
                splitInstanceRef.current.lines ||
                []

            if (elements.length === 0) return

            // Reset parent element opacity to 1 so child elements can be visible
            gsap.set(element, { opacity: 1 })

            // Set initial state on split elements
            gsap.set(elements, from)

            // Create animation
            const animation = gsap.to(elements, {
                ...to,
                duration,
                delay,
                ease,
                stagger,
            })

            if (animateOnScroll) {
                // Use ScrollTrigger for scroll-based animation
                ScrollTrigger.create({
                    trigger: element,
                    start: scrollStart,
                    animation,
                    toggleActions: scrollOnce ? 'play none none none' : 'play none none reverse',
                    once: scrollOnce,
                })
            } else {
                // Play animation immediately
                animation.play()
            }

            animationRef.current = animation
        }

        initializeSplitText()

        return cleanup
    }, []) // Only run once on mount/unmount - options are read from ref

    return {
        ref: elementRef,
        splitInstance: splitInstanceRef.current,
    }
}

type SplitTextProps = {
    children: React.ReactNode
    as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'section' | 'article'
    className?: string
    style?: React.CSSProperties
} & SplitTextAnimationOptions

export const SplitTextComponent: React.FC<SplitTextProps> = ({
    children,
    as = 'div',
    className = '',
    style,
    ...animationOptions
}) => {
    const { ref } = useSplitText(animationOptions)

    return React.createElement(as, { ref, className: `split-text ${className}`, style }, children)
}

// Alternative: Direct hook usage for more control
export const useSplitTextRef = (options: SplitTextAnimationOptions = {}) => {
    return useSplitText(options)
}
