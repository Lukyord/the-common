/*::* HANDLE VIDEO SOURCE *::*/
type VideoElementWithDataset = HTMLVideoElement & {
  dataset: {
    vdoSrc?: string
    vdoSrcset?: string
    [key: string]: string | undefined
  }
}

export function updateVideoSource(element: VideoElementWithDataset): void {
  const vdoSrc = element.dataset.vdoSrc
  const vdoSrcset = element.dataset.vdoSrcset || ''

  if (!vdoSrc) return

  const viewportWidth = window.innerWidth
  const nextSrc = viewportWidth < 992 && vdoSrcset ? vdoSrcset : vdoSrc

  element.setAttribute('src', nextSrc)
}

export function initializeVideos(): void {
  const elements = document.querySelectorAll<VideoElementWithDataset>('.vdojs')
  elements.forEach(updateVideoSource)
}
