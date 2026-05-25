import type { Homepage } from '@/payload-types'

export type BingoProps = {
  data?: Homepage['bingo']
}

export type BingoGridItem = {
  id: string
  text: string | null | undefined
}

export type StampLayout = {
  x: number
  y: number
  width: number
  height: number
}
