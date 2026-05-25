export const BINGO_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const

export type BingoLineKind = 'row' | 'col' | 'diag'

export type CompletedBingoLine = {
  id: string
  kind: BingoLineKind
  indices: readonly number[]
}

export function getCompletedBingoLines(filled: boolean[]): CompletedBingoLine[] {
  return BINGO_LINES.flatMap((indices, index) => {
    if (!indices.every((cell) => filled[cell])) return []

    const kind: BingoLineKind = index < 3 ? 'row' : index < 6 ? 'col' : 'diag'
    return [{ id: `line-${index}`, kind, indices }]
  })
}
