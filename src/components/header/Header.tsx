import './header.css'

import type { Branch } from '@/payload-types'
import { getBranches } from '@/payload/queries/branch'
import { HeaderClient } from './HeaderClient'
import type { HeaderBranchItem } from './header-types'

export async function Header() {
  const branches = await getBranches()

  return <HeaderClient branches={branches.map(toHeaderBranchItem)} />
}

function toHeaderBranchItem(branch: Branch): HeaderBranchItem {
  return {
    slug: branch.slug,
    primaryColor: branch.primaryColor ?? null,
    bgColor: branch.bgColor ?? null,
  }
}
