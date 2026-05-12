'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CursorFollower() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [isHoveringView, setIsHoveringView] = useState(false)
    const [isHoveringColor, setIsHoveringColor] = useState(false)
    const mousePosition = useRef({ x: 0, y: 0 })
    const cursorPosition = useRef({ x: 0, y: 0 })
    const animationRef = useRef<gsap.core.Tween | null>(null)

    useEffect(() => {
        const cursor = cursorRef.current
        if (!cursor) return

        // Helper function to check if element is clickable
        const isClickableElement = (element: HTMLElement | null): boolean => {
            if (!element) return false

            // Check for explicit .hover-view class (highest priority)
            if (element.closest('.hover-view')) return false

            // Check for explicit .hover-color class
            if (element.closest('.hover-color')) return false

            // Check for explicit .hover class
            if (element.closest('.hover')) return true

            // Check if element is a clickable HTML element
            const tagName = element.tagName.toLowerCase()
            const clickableTags = ['a', 'button', 'input', 'select', 'textarea', 'label']
            if (clickableTags.includes(tagName)) {
                // For input, check if it's not disabled
                if (
                    tagName === 'input' ||
                    tagName === 'button' ||
                    tagName === 'select' ||
                    tagName === 'textarea'
                ) {
                    const isDisabled =
                        element.hasAttribute('disabled') || (element as HTMLInputElement).disabled
                    return !isDisabled
                }
                return true
            }

            // Check for role="button" or role="link"
            const role = element.getAttribute('role')
            if (role === 'button' || role === 'link') {
                return true
            }

            // Check if element has cursor: pointer style
            const computedStyle = window.getComputedStyle(element)
            if (computedStyle.cursor === 'pointer') {
                return true
            }

            // Check if element has onclick handler
            if (element.onclick !== null) {
                return true
            }

            return false
        }

        // Track mouse position
        const handleMouseMove = (e: MouseEvent) => {
            mousePosition.current = { x: e.clientX, y: e.clientY }

            // Animate cursor to mouse position
            if (animationRef.current) {
                animationRef.current.kill()
            }

            animationRef.current = gsap.to(cursorPosition.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out',
                onUpdate: () => {
                    if (cursor) {
                        cursor.style.left = `${cursorPosition.current.x}px`
                        cursor.style.top = `${cursorPosition.current.y}px`
                    }
                },
            })
        }

        // Check hover state on elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const hoverViewElement = target.closest('.hover-view')
            const hoverElement = target.closest('.hover')
            const hoverColor = target.closest('.hover-color')

            if (hoverViewElement) {
                setIsHoveringView(true)
                setIsHovering(false)
                setIsHoveringColor(false)
            } else if (hoverElement || isClickableElement(target)) {
                setIsHovering(true)
                setIsHoveringView(false)
                setIsHoveringColor(false)
            } else if (hoverColor) {
                setIsHoveringColor(true)
                setIsHovering(false)
                setIsHoveringView(false)
            } else {
                setIsHovering(false)
                setIsHoveringView(false)
                setIsHoveringColor(false)
            }
        }

        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseover', handleMouseOver)
            if (animationRef.current) {
                animationRef.current.kill()
            }
        }
    }, [])

    return (
        <div
            ref={cursorRef}
            className={`
                cursor-follower 
                ${isHovering ? 'is-hovering' : ''} 
                ${isHoveringView ? 'is-hovering-view' : ''}
                ${isHoveringColor ? 'is-hovering-color' : ''}
                `}
        >
            <span>View</span>
        </div>
    )
}
