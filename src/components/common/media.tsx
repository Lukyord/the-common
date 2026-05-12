'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { updateVideoSource } from '@/utils/functions/video'

type MediaProps = {
    src: string
    srcMobile?: string
    alt?: string
    className?: string
    priority?: boolean
}

type VideoElementWithDataset = HTMLVideoElement & {
    dataset: {
        vdoSrc?: string
        vdoSrcset?: string
        [key: string]: string | undefined
    }
}

function isImage(src: string): boolean {
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(src)
}

function isVideo(src: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(src)
}

export default function RenderMedia({
    src,
    srcMobile,
    alt = '',
    className = '',
    priority = false,
}: MediaProps) {
    const videoRef = useRef<VideoElementWithDataset>(null)

    useEffect(() => {
        const videoElement = videoRef.current
        if (videoElement && videoElement.classList.contains('vdojs')) {
            // Initialize video source on mount
            updateVideoSource(videoElement)

            // Also update on resize to handle viewport changes
            const handleResize = () => {
                updateVideoSource(videoElement)
            }

            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [])

    // If no src provided, show message
    if (!src || src.trim() === '') {
        return <p>No media available.</p>
    }

    const mobileSrc = srcMobile || src
    const isImageDesktop = isImage(src)
    const isImageMobile = isImage(mobileSrc)
    const isVideoDesktop = isVideo(src)
    const isVideoMobile = isVideo(mobileSrc)

    const baseClasses = `object-fit ${className}`.trim()

    // Case 1: Both are images - use Next.js Image with responsive display
    if (isImageDesktop && isImageMobile) {
        return (
            <>
                {/* Desktop version */}
                <figure className={`${baseClasses} show-md`}>
                    <Image src={src} alt={alt} priority={priority} width={100} height={100} />
                </figure>
                {/* Mobile version */}
                <figure className={`${baseClasses} hidden-device-md`}>
                    <Image src={mobileSrc} alt={alt} priority={priority} width={100} height={100} />
                </figure>
            </>
        )
    }

    // Case 2: Both are videos - use figure with vdojs class
    if (isVideoDesktop && isVideoMobile) {
        return (
            <figure className={baseClasses}>
                <video
                    ref={videoRef}
                    className="vdojs"
                    data-vdo-src={src}
                    data-vdo-srcset={mobileSrc}
                    playsInline
                    autoPlay
                    muted
                    loop
                    preload="auto"
                    src=""
                />
            </figure>
        )
    }

    // Case 3: Mixed types or only one source - render separately for desktop and mobile
    return (
        <>
            {/* Desktop version */}
            <figure className={`${baseClasses} show-md`}>
                {isVideoDesktop ? (
                    <video playsInline autoPlay muted loop preload="auto" src={src} />
                ) : (
                    <Image src={src} alt={alt} priority={priority} width={100} height={100} />
                )}
            </figure>

            {/* Mobile version */}
            <figure className={`${baseClasses} hidden-device-md`}>
                {isVideoMobile ? (
                    <video playsInline autoPlay muted loop preload="auto" src={mobileSrc} />
                ) : (
                    <Image src={mobileSrc} alt={alt} priority={priority} width={100} height={100} />
                )}
            </figure>
        </>
    )
}
