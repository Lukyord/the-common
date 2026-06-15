import path from 'path'
import { fileURLToPath } from 'url'

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url))
const MIGRATION_ROOT = path.resolve(LIB_DIR, '..')
const REPO_ROOT = path.resolve(MIGRATION_ROOT, '../..')

export const MIGRATION_DIR = MIGRATION_ROOT
export const REPO_ROOT_DIR = REPO_ROOT

export function repoPath(...segments: string[]): string {
  return path.resolve(REPO_ROOT, ...segments)
}

export function migrationPath(...segments: string[]): string {
  return path.resolve(MIGRATION_ROOT, ...segments)
}

export function schemaPath(schema: string, ...segments: string[]): string {
  return migrationPath(schema, ...segments)
}
