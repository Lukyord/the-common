import fs from 'fs'

export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true })
}

export function writeJsonReport(filePath: string, data: unknown) {
  ensureDir(filePath.replace(/[/\\][^/\\]+$/, ''))
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}
