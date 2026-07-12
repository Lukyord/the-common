/**
 * Strip `-{branch}` suffixes from vendor slugs (e.g. all-kinds-thonglor → all-kinds).
 *
 * Default: dry-run. Pass --write to apply.
 * Prod: NODE_ENV=production (remote D1 via wrangler).
 *
 * Usage:
 *   pnpm strip:vendor-slugs:prod
 *   pnpm strip:vendor-slugs:prod -- --write
 */

import type { Vendor } from '../../src/payload-types.js'
import { getMigrationPayload } from './lib/getPayloadLocal.js'
import { checkMigrationPrerequisites, printPrerequisiteResults } from './lib/checkMigrationPrerequisites.js'
import { printDryRunBanner, runMigrationScript } from './lib/cli.js'

type Options = {
  dryRun: boolean
  remote: boolean
}

type SlugChange = {
  id: number
  name: string
  branchSlug: string
  before: string
  after: string
  status: 'rename' | 'skip-conflict' | 'skip-no-suffix'
  reason?: string
}

function parseArgs(argv = process.argv.slice(2)): Options {
  return {
    dryRun: !argv.includes('--write'),
    remote: argv.includes('--remote') || process.env.NODE_ENV === 'production',
  }
}

function getBranchSlug(vendor: Vendor): string | null {
  const branch = vendor.branch
  if (branch && typeof branch === 'object' && typeof branch.slug === 'string') {
    return branch.slug
  }
  return null
}

function stripBranchSuffix(slug: string, branchSlug: string): string | null {
  const suffix = `-${branchSlug}`
  if (!slug.endsWith(suffix)) return null
  const base = slug.slice(0, -suffix.length)
  return base.length > 0 ? base : null
}

function planChanges(vendors: Vendor[]): SlugChange[] {
  const changes: SlugChange[] = []
  const reserved = new Set(vendors.map((v) => v.slug).filter(Boolean) as string[])

  // Process in stable id order so the first claimant gets the unsuffixed slug
  const sorted = [...vendors].sort((a, b) => a.id - b.id)

  for (const vendor of sorted) {
    const branchSlug = getBranchSlug(vendor)
    const before = vendor.slug

    if (!before || !branchSlug) {
      changes.push({
        id: vendor.id,
        name: vendor.name,
        branchSlug: branchSlug ?? '?',
        before: before ?? '',
        after: before ?? '',
        status: 'skip-no-suffix',
        reason: !before ? 'missing slug' : 'missing branch slug',
      })
      continue
    }

    const after = stripBranchSuffix(before, branchSlug)
    if (!after) {
      changes.push({
        id: vendor.id,
        name: vendor.name,
        branchSlug,
        before,
        after: before,
        status: 'skip-no-suffix',
      })
      continue
    }

    // Free the current slug before checking the target (same vendor)
    reserved.delete(before)

    if (reserved.has(after)) {
      reserved.add(before)
      changes.push({
        id: vendor.id,
        name: vendor.name,
        branchSlug,
        before,
        after: before,
        status: 'skip-conflict',
        reason: `target "${after}" already taken`,
      })
      continue
    }

    reserved.add(after)
    changes.push({
      id: vendor.id,
      name: vendor.name,
      branchSlug,
      before,
      after,
      status: 'rename',
    })
  }

  return changes
}

function printReport(changes: SlugChange[]) {
  const renames = changes.filter((c) => c.status === 'rename')
  const conflicts = changes.filter((c) => c.status === 'skip-conflict')
  const unchanged = changes.filter((c) => c.status === 'skip-no-suffix')

  console.log('')
  console.log('BEFORE → AFTER (renames)')
  console.log('============================================================')
  if (!renames.length) {
    console.log('(none)')
  } else {
    for (const c of renames) {
      console.log(
        `[${c.branchSlug}] #${c.id} ${c.name}\n  ${c.before}  →  ${c.after}`,
      )
    }
  }

  if (conflicts.length) {
    console.log('')
    console.log('SKIPPED (slug conflict — kept branch suffix)')
    console.log('============================================================')
    for (const c of conflicts) {
      console.log(`[${c.branchSlug}] #${c.id} ${c.name}\n  ${c.before}  (kept) — ${c.reason}`)
    }
  }

  console.log('')
  console.log('Summary')
  console.log('============================================================')
  console.log(`Rename:            ${renames.length}`)
  console.log(`Skip (conflict):   ${conflicts.length}`)
  console.log(`Skip (no suffix):  ${unchanged.length}`)
  console.log(`Total vendors:     ${changes.length}`)
}

async function main() {
  const options = parseArgs()

  console.log('Strip vendor branch suffixes from slugs')
  console.log(options.remote ? 'Target: production D1' : 'Target: local D1')
  console.log('============================================================')

  printPrerequisiteResults(
    checkMigrationPrerequisites({
      dryRun: options.dryRun,
      remote: options.remote,
      localAssetsDir: null,
    }),
  )

  if (options.dryRun) printDryRunBanner()

  const payload = await getMigrationPayload()
  const { docs } = await payload.find({
    collection: 'vendors',
    depth: 1,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    sort: 'id',
  })

  const changes = planChanges(docs)
  printReport(changes)

  const renames = changes.filter((c) => c.status === 'rename')
  if (options.dryRun || !renames.length) {
    if (options.dryRun && renames.length) {
      console.log('')
      console.log('Re-run with --write to apply these renames.')
    }
    return
  }

  console.log('')
  console.log('Applying renames...')
  for (const change of renames) {
    await payload.update({
      collection: 'vendors',
      id: change.id,
      data: { slug: change.after },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`  ✓ #${change.id} ${change.before} → ${change.after}`)
  }

  console.log('')
  console.log(`Updated ${renames.length} vendor slug(s).`)
}

runMigrationScript(main)
