import React from 'react'

import { getBranchBySlug } from '@/payload/queries/branch'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ branch: string }>
}

export default async function BranchPage({ params }: Props) {
  const { branch: slug } = await params
  const branch = await getBranchBySlug(slug)

  return (
    <main id="main">
      <h1>{branch.name}</h1>

      <div style={{ height: '100vh' }}></div>
    </main>
  )
}
