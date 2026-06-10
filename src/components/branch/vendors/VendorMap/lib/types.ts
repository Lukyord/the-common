export const MAP_PLAN_WIDTH = 820

function getViewBoxDimensions(viewBox: string): { width: number; height: number } {
  const [, , width, height] = viewBox.trim().split(/\s+/).map(Number)
  return { width: width || 0, height: height || 0 }
}

export function getAspectRatioFromViewBox(viewBox: string): number {
  const { width, height } = getViewBoxDimensions(viewBox)
  if (!width || !height) return 1
  return width / height
}

export function getWidthFromViewBox(
  viewBox: string,
  mapPlanWidth = MAP_PLAN_WIDTH,
): string {
  const { width } = getViewBoxDimensions(viewBox)
  if (!width || !mapPlanWidth) return '0%'
  return `${(width / mapPlanWidth) * 100}%`
}
