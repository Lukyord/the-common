import React from 'react'

import { getBranchBySlug } from '@/payload/queries/branch'

type Props = {
  children: React.ReactNode
  params: Promise<{ branch: string }>
}

export default async function BranchLayout({ children, params }: Props) {
  const { branch } = await params
  await getBranchBySlug(branch)

  return children
}
