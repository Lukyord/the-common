import fs from 'fs'

import { writeJsonReport } from '../fs.js'

export type RollbackLogEntry = {
  legacyIndex: number
  legacyId: string
  slug: string
  branchSlug: string
  action: 'created' | 'branch_merged'
  mediaLegacyPaths: string[]
  migratedAt: string
  rolledBackAt?: string
}

export type RollbackLog = {
  entries: RollbackLogEntry[]
}

export function loadRollbackLog(logPath: string): RollbackLog | null {
  if (!fs.existsSync(logPath)) return null
  return JSON.parse(fs.readFileSync(logPath, 'utf8')) as RollbackLog
}

export function saveRollbackLog(logPath: string, log: RollbackLog) {
  writeJsonReport(logPath, log)
}

export function appendRollbackLog(logPath: string, entry: Omit<RollbackLogEntry, 'migratedAt'>) {
  const log = loadRollbackLog(logPath) ?? { entries: [] }
  log.entries.push({ ...entry, migratedAt: new Date().toISOString() })
  saveRollbackLog(logPath, log)
}

export function getPendingRollbackEntries(
  log: RollbackLog,
  indexes: number[] | null,
): RollbackLogEntry[] {
  let entries = log.entries.filter((entry) => !entry.rolledBackAt)

  if (indexes) {
    const indexSet = new Set(indexes)
    entries = entries.filter((entry) => indexSet.has(entry.legacyIndex))
  }

  return [...entries].reverse()
}
