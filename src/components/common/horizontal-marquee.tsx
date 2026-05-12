'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type HorizontalMarqueeProps = {
    children: React.ReactNode
    speed?: number // Duration in seconds (lower = faster)
    direction?: 'left' | 'right'
}

export default function HorizontalMarquee({
    children,
    speed = 10,
    direction = 'left',
}: HorizontalMarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<gsap.core.Tween | null>(null)
    const [duplicateCount, setDuplicateCount] = useState(2)

    useEffect(() => {
        const container = containerRef.current
        const wrapper = wrapperRef.current

        if (!container || !wrapper) return

        const calculateDuplicates = () => {
            const firstChild = wrapper.firstElementChild as HTMLElement
            if (!firstChild) return

            const contentWidth = firstChild.offsetWidth
            const viewportWidth = window.innerWidth

            const neededCopies = Math.ceil(viewportWidth / contentWidth) + 2
            setDuplicateCount(neededCopies)
        }

        const rafId = requestAnimationFrame(() => {
            calculateDuplicates()
        })

        const handleResize = () => {
            calculateDuplicates()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        const container = containerRef.current
        const wrapper = wrapperRef.current

        if (!container || !wrapper || duplicateCount < 2) return

        const initAnimation = () => {
            if (!wrapper) return

            const firstChild = wrapper.firstElementChild as HTMLElement
            if (!firstChild) return

            const contentWidth = firstChild.offsetWidth
            const moveDistance = direction === 'left' ? -contentWidth : contentWidth

            // Reset position to 0
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

        // Use requestAnimationFrame to ensure layout is complete
        const rafId = requestAnimationFrame(() => {
            initAnimation()
        })

        // Pause on hover
        const handleMouseEnter = () => {
            animationRef.current?.pause()
        }

        const handleMouseLeave = () => {
            animationRef.current?.resume()
        }

        container.addEventListener('mouseenter', handleMouseEnter)
        container.addEventListener('mouseleave', handleMouseLeave)

        // Cleanup
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
