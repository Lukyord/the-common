import fs from 'fs'
import path from 'path'

import sharp from 'sharp'

import { ensureDir } from '../fs.js'
import { legacyPathToUrl } from './legacyPathToUrl.js'
import { extractDominantColor } from './extractDominantColor.js'

export type ConvertedMediaFile = {
  legacyPath: string
  sourceUrl: string
  webpPath: string
  size: number
  dominantColor: string
}

export type MediaDownloadOptions = {
  localAssetsDir?: string
  awsProfile?: string
}

export type MediaConvertContext = {
  cacheDir: string
  webpQuality: number
  s3BaseUrl: string
}

function getLocalAssetPath(localAssetsDir: string, legacyPath: string): string {
  return path.join(localAssetsDir, legacyPath)
}

async function readLegacyImageBuffer(
  legacyPath: string,
  context: MediaConvertContext,
  options: MediaDownloadOptions = {},
): Promise<Buffer> {
  if (options.localAssetsDir) {
    const localPath = getLocalAssetPath(options.localAssetsDir, legacyPath)
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath)
    }
  }

  const sourceUrl = legacyPathToUrl(legacyPath, context.s3BaseUrl)
  const response = await fetch(sourceUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sourceUrl} (${response.status})`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function convertLegacyImageToWebp(
  legacyPath: string,
  context: MediaConvertContext,
  options: MediaDownloadOptions = {},
): Promise<ConvertedMediaFile> {
  ensureDir(context.cacheDir)

  const basename = legacyPath.replace(/[/\\]/g, '__').replace(/\.[^.]+$/, '')
  const webpPath = path.join(context.cacheDir, `${basename}.webp`)
  const sourceUrl = legacyPathToUrl(legacyPath, context.s3BaseUrl)

  if (fs.existsSync(webpPath)) {
    const stats = fs.statSync(webpPath)
    const dominantColor = await extractDominantColor(fs.readFileSync(webpPath))

    return {
      legacyPath,
      sourceUrl,
      webpPath,
      size: stats.size,
      dominantColor,
    }
  }

  const input = await readLegacyImageBuffer(legacyPath, context, options)
  const dominantColor = await extractDominantColor(input)
  const webp = await sharp(input).webp({ quality: context.webpQuality }).toBuffer()
  fs.writeFileSync(webpPath, webp)

  return {
    legacyPath,
    sourceUrl,
    webpPath,
    size: webp.length,
    dominantColor,
  }
}

export function readWebpFile(webpPath: string): Buffer {
  return fs.readFileSync(webpPath)
}

export function webpFilenameForLegacyPath(legacyPath: string, slug: string, index?: number): string {
  const suffix = index == null ? '' : `-gallery-${index + 1}`
  return `${slug}${suffix}.webp`
}
