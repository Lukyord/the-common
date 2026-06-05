import type { CardBranchDotItem } from './types'

type CardBranchDotsProps = {
  branches: CardBranchDotItem[]
}

export default function CardBranchDots({ branches }: CardBranchDotsProps) {
  if (!branches.length) return null

  return (
    <span className="card-branch-dots" aria-hidden>
      {branches.map((branch) => (
        <span
          key={branch.slug}
          className="card-branch-dot"
          data-branch={branch.slug}
          style={{ backgroundColor: branch.bgColor ?? undefined }}
        >
          <span className="branch-dot-name">{branch.name}</span>
        </span>
      ))}
    </span>
  )
}
