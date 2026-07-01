import './header.css'

import { resolveMedia } from '@/lib/resolveMedia'
import type { Branch } from '@/payload-types'
import { getBranches } from '@/payload/queries/branch'
import { HeaderClient } from './HeaderClient'
import type { HeaderBranchItem } from './header-types'

export async function Header() {
  const branches = await getBranches()

  return <HeaderClient branches={branches.map(toHeaderBranchItem)} />
}

function toHeaderBranchItem(branch: Branch): HeaderBranchItem {
  const logo = resolveMedia(branch.logo)

  return {
    slug: branch.slug,
    name: branch.name,
    primaryColor: branch.primaryColor ?? null,
    bgColor: branch.bgColor ?? null,
    logo: logo?.src ? { src: logo.src, alt: logo.alt || branch.name } : null,
  }
}
