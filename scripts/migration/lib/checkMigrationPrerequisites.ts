import fs from 'fs'

import type { MigrationCliOptions } from './cli.js'
import { repoPath } from './paths.js'

export type PrerequisiteCheck = {
  ok: boolean
  errors: string[]
  warnings: string[]
}

function readPayloadSecret(): string | null {
  for (const file of ['.env.local', '.env']) {
    const filePath = repoPath(file)
    if (!fs.existsSync(filePath)) continue

    const match = fs.readFileSync(filePath, 'utf8').match(/^PAYLOAD_SECRET=(.+)$/m)
    const value = match?.[1]?.trim()
    if (value) return value
  }

  return process.env.PAYLOAD_SECRET?.trim() || null
}

function hasLocalD1Database(): boolean {
  const d1Root = repoPath('.wrangler/state/v3/d1/miniflare-D1DatabaseObject')
  if (!fs.existsSync(d1Root)) return false

  return fs
    .readdirSync(d1Root)
    .some(
      (name) =>
        name.endsWith('.sqlite') && !name.endsWith('-wal') && !name.endsWith('-shm'),
    )
}

export type MigrationPrerequisiteOptions = Pick<MigrationCliOptions, 'dryRun' | 'localAssetsDir'> & {
  legacyDataPath?: string
}

export function checkMigrationPrerequisites(
  options: MigrationPrerequisiteOptions,
): PrerequisiteCheck {
  const errors: string[] = []
  const warnings: string[] = []

  if (options.legacyDataPath && !fs.existsSync(options.legacyDataPath)) {
    errors.push(`Legacy data file not found: ${options.legacyDataPath}`)
  }

  if (!readPayloadSecret()) {
    errors.push('PAYLOAD_SECRET is missing. Add it to .env.local or .env')
  }

  if (!hasLocalD1Database()) {
    errors.push(
      'Local D1 database not found. Run `pnpm dev` once to initialize .wrangler/state, then retry.',
    )
  }

  if (!options.localAssetsDir) {
    warnings.push(
      'No --assets-dir provided. Images will be fetched from legacy S3 (may fail if the bucket is private).',
    )
  } else if (!fs.existsSync(options.localAssetsDir)) {
    errors.push(`Assets directory not found: ${options.localAssetsDir}`)
  }

  if (options.dryRun) {
    warnings.push('Dry-run mode — no DB/R2 writes. Pass --write to import.')
  }

  return { ok: errors.length === 0, errors, warnings }
}

export function printPrerequisiteResults(result: PrerequisiteCheck) {
  if (result.warnings.length) {
    console.log('Warnings:')
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`)
    }
    console.log('')
  }

  if (result.errors.length) {
    console.error('Prerequisites failed:')
    for (const error of result.errors) {
      console.error(`  - ${error}`)
    }
    throw new Error('Migration prerequisites not met')
  }

  console.log('Prerequisites OK')
}

export function checkRollbackPrerequisites(dryRun: boolean): PrerequisiteCheck {
  const errors: string[] = []
  const warnings: string[] = []

  if (!readPayloadSecret()) {
    errors.push('PAYLOAD_SECRET is missing. Add it to .env.local or .env')
  }

  if (!hasLocalD1Database()) {
    errors.push(
      'Local D1 database not found. Run `pnpm dev` once to initialize .wrangler/state, then retry.',
    )
  }

  if (dryRun) {
    warnings.push('Dry-run mode — no deletions. Pass --write to rollback.')
  }

  return { ok: errors.length === 0, errors, warnings }
}
