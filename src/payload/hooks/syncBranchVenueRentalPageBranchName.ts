import type { CollectionBeforeChangeHook } from 'payload'

import type { Branch } from '@/payload-types'

async function resolveBranchName(
  branchRef: number | Branch | null | undefined,
  findBranch: (id: number) => Promise<Branch>,
): Promise<string | undefined> {
  if (!branchRef) return undefined

  if (typeof branchRef === 'object') {
    return branchRef.name ?? undefined
  }

  if (typeof branchRef === 'number') {
    const branch = await findBranch(branchRef)
    return branch.name ?? undefined
  }

  return undefined
}

export const syncBranchVenueRentalPageBranchName: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const branchRef = data?.branch ?? originalDoc?.branch
  const branchName = await resolveBranchName(branchRef, (id) =>
    req.payload.findByID({
      collection: 'branches',
      id,
      depth: 0,
    }),
  )

  if (!branchName) return data

  return {
    ...data,
    branchName,
  }
}
