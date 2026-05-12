/*::* HANDLE SCROLL *::*/
let previousScrollY = 0

export function updateScrollTheme(): void {
  const html = document.documentElement
  const currentScrollY = window.scrollY
  const scrollDifference = previousScrollY - currentScrollY

  // Page scroll direction classes
  if (currentScrollY <= 0) {
    html.classList.remove('page-scrolling', 'page-scrolling--up', 'page-scrolling--down')
  } else {
    html.classList.add('page-scrolling')

    if (scrollDifference > 0) {
      html.classList.add('page-scrolling--up')
      html.classList.remove('page-scrolling--down')
    } else {
      html.classList.add('page-scrolling--down')
      html.classList.remove('page-scrolling--up')
    }
  }

  previousScrollY = currentScrollY

  // Main section position classes
  const bound = document.getElementById('main')
  if (bound) {
    const scrollTop = window.scrollY
    const boundRect = bound.getBoundingClientRect()
    const boundTop = boundRect.top + scrollTop
    const boundBottom = boundTop + boundRect.height
    const windowHeight = window.innerHeight
    const currentScrollOffset = scrollTop + windowHeight

    if (scrollTop > boundTop) {
      html.classList.add('main-start')
    } else {
      html.classList.remove('main-start')
    }

    if (currentScrollOffset < boundBottom) {
      html.classList.add('main-start')
      html.classList.remove('main-end')
    } else {
      html.classList.remove('main-start')
      html.classList.add('main-end')
    }
  }
}
