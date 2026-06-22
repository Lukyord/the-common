export function captureResultsShellHeight(shell: HTMLDivElement | null) {
  if (!shell) return null

  const height = shell.offsetHeight
  return height > 0 ? height : null
}

function clearResultsShellTransition(shell: HTMLDivElement) {
  shell.style.minHeight = ''
  shell.style.transition = ''
  shell.classList.remove('is-height-transitioning')
}

export function animateResultsShellHeight(shell: HTMLDivElement | null, startHeight: number | null) {
  if (!shell || startHeight == null) return

  shell.style.minHeight = `${startHeight}px`
  shell.classList.add('is-height-transitioning')

  requestAnimationFrame(() => {
    const endHeight = shell.scrollHeight

    if (Math.abs(endHeight - startHeight) < 2) {
      clearResultsShellTransition(shell)
      return
    }

    shell.style.transition = 'min-height var(--duration) var(--timing-function)'

    requestAnimationFrame(() => {
      shell.style.minHeight = `${endHeight}px`

      const cleanup = () => clearResultsShellTransition(shell)
      shell.addEventListener('transitionend', cleanup, { once: true })
      window.setTimeout(cleanup, 400)
    })
  })
}
