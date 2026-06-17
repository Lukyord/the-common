'use client'

import { useCallback } from 'react'

import type { CardBranchDotItem } from './types'

type CardBranchDotsProps = {
  branches: CardBranchDotItem[]
}

const ALIGN_RESET_DELAY_MS = 300
const alignResetTimeouts = new WeakMap<HTMLSpanElement, ReturnType<typeof setTimeout>>()

function clearAlignResetTimeout(dot: HTMLSpanElement) {
  const timeoutId = alignResetTimeouts.get(dot)
  if (timeoutId === undefined) return

  clearTimeout(timeoutId)
  alignResetTimeouts.delete(dot)
}

function updateDotAlignment(dot: HTMLSpanElement) {
  const name = dot.querySelector<HTMLElement>('.branch-dot-name')
  if (!name) return

  delete dot.dataset.align

  if (name.getBoundingClientRect().right > window.innerWidth - 50) {
    dot.dataset.align = 'left'
    requestAnimationFrame(() => {
      if (name.getBoundingClientRect().left < 0) {
        delete dot.dataset.align
      }
    })
  }
}

export default function CardBranchDots({ branches }: CardBranchDotsProps) {
  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    const dot = event.currentTarget
    clearAlignResetTimeout(dot)
    updateDotAlignment(dot)
  }, [])

  const handleMouseLeave = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    const dot = event.currentTarget
    clearAlignResetTimeout(dot)
    alignResetTimeouts.set(
      dot,
      setTimeout(() => {
        alignResetTimeouts.delete(dot)
        delete dot.dataset.align
      }, ALIGN_RESET_DELAY_MS),
    )
  }, [])

  if (!branches.length) return null

  return (
    <span className="card-branch-dots" aria-hidden>
      {[...branches].reverse().map((branch) => (
        <span
          key={branch.slug}
          className="card-branch-dot"
          data-branch={branch.slug}
          style={{ backgroundColor: branch.footerBgColor ?? undefined }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="branch-dot-name">{branch.name}</span>
        </span>
      ))}
    </span>
  )
}
