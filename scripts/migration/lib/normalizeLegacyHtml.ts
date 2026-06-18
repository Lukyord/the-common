import { JSDOM } from 'jsdom'

import { normalizeLegacyHref } from './normalizeLegacyHref.js'

function unwrapAnchor(anchor: Element) {
  const parent = anchor.parentNode
  if (!parent) return

  while (anchor.firstChild) {
    parent.insertBefore(anchor.firstChild, anchor)
  }

  parent.removeChild(anchor)
}

function unwrapAllDivs(root: Element) {
  const divs = [...root.querySelectorAll('div')].reverse()

  for (const div of divs) {
    const parent = div.parentNode
    if (!parent) continue

    while (div.firstChild) {
      parent.insertBefore(div.firstChild, div)
    }

    parent.removeChild(div)
  }
}

function stripInlineImages(body: HTMLElement) {
  body.querySelectorAll('img').forEach((img) => img.remove())

  body.querySelectorAll('figure').forEach((figure) => {
    if (!figure.textContent?.replace(/\u00a0/g, ' ').trim()) {
      figure.remove()
    }
  })
}

export function normalizeLegacyHtml(html: string): string {
  const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`)
  const body = dom.window.document.body

  body.querySelectorAll('a').forEach((anchor) => {
    const href = anchor.getAttribute('href')
    if (!href) {
      unwrapAnchor(anchor)
      return
    }

    const normalized = normalizeLegacyHref(href)
    if (!normalized) {
      unwrapAnchor(anchor)
      return
    }

    anchor.setAttribute('href', normalized)
  })

  unwrapAllDivs(body)
  stripInlineImages(body)

  return body.innerHTML.trim()
}
