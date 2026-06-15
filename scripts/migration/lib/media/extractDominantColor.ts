import sharp from 'sharp'

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

export async function extractDominantColor(input: Buffer): Promise<string> {
  const { data, info } = await sharp(input)
    .resize(64, 64, { fit: 'cover' })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const buckets = new Map<number, number>()

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] ?? 0
    const g = data[i + 1] ?? 0
    const b = data[i + 2] ?? 0
    const qr = (r >> 4) << 4
    const qg = (g >> 4) << 4
    const qb = (b >> 4) << 4
    const key = (qr << 16) | (qg << 8) | qb
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }

  let bestKey = 0
  let bestCount = -1

  for (const [key, count] of buckets) {
    if (count > bestCount) {
      bestCount = count
      bestKey = key
    }
  }

  return rgbToHex((bestKey >> 16) & 0xff, (bestKey >> 8) & 0xff, bestKey & 0xff)
}
