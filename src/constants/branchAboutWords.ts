export const BRANCH_ABOUT_WORD_OPTIONS = [
  { label: 'Explore', value: 'explore' },
  { label: 'Pamper', value: 'pamper' },
  { label: 'Move', value: 'move' },
  { label: 'Eat', value: 'eat' },
  { label: 'Give back', value: 'give-back' },
  { label: 'Gather', value: 'gather' },
] as const

export type BranchAboutWord = (typeof BRANCH_ABOUT_WORD_OPTIONS)[number]['value']

export const BRANCH_ABOUT_WORDS_BY_SLUG: Record<string, readonly BranchAboutWord[]> = {
  thonglor: ['explore', 'pamper', 'move', 'eat', 'give-back'],
  saladaeng: ['explore', 'pamper', 'eat', 'give-back'],
  'cloud-11': ['explore', 'move', 'pamper', 'gather', 'eat', 'give-back'],
}

export function getBranchAboutWordLabel(word: BranchAboutWord): string {
  return BRANCH_ABOUT_WORD_OPTIONS.find((option) => option.value === word)?.label ?? word
}
