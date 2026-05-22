import type { CSSProperties } from 'react'

import type { Branch } from '@/payload-types'

function themeStyle(vars: Record<string, string | undefined>): CSSProperties | undefined {
  const style: Record<string, string> = {}

  for (const [key, value] of Object.entries(vars)) {
    if (value) style[key] = value
  }

  return Object.keys(style).length > 0 ? (style as CSSProperties) : undefined
}

export function branchHeaderThemeStyle(branch?: Branch | null): CSSProperties | undefined {
  if (!branch) return undefined

  return themeStyle({
    '--bg-color': branch.bgColor ?? undefined,
    '--color': branch.primaryColor ?? undefined,
  })
}

export function branchFooterThemeStyle(branch?: Branch | null): CSSProperties | undefined {
  if (!branch) return undefined

  return themeStyle({
    '--bg-color': branch.footerBg ?? undefined,
    '--color': branch.footerColor ?? undefined,
  })
}
