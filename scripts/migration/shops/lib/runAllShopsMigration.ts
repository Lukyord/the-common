import {
  checkMigrationPrerequisites,
  printPrerequisiteResults,
} from '../../lib/checkMigrationPrerequisites.js'
import type { MigrationCliOptions } from '../../lib/cli.js'
import { printDryRunBanner } from '../../lib/cli.js'
import {
  getBranchVendorConfig,
  parseReplaceArg,
  resolveShopBranchSlugs,
  supportsVendorMedia,
  type ShopBranchSlug,
} from '../config/branches.js'
import { runShopsMigrationPipeline } from './migrationPipeline.js'
import { runVendorMediaPipeline } from './vendorMediaPipeline.js'

async function runBranchMigration(
  options: MigrationCliOptions,
  branchSlug: ShopBranchSlug,
) {
  const config = getBranchVendorConfig(branchSlug)

  console.log('')
  console.log('============================================================')
  console.log(`${branchSlug} — vendor data`)
  console.log('============================================================')

  printPrerequisiteResults(
    checkMigrationPrerequisites({ ...options, legacyDataPath: config.csvPath }),
  )

  await runShopsMigrationPipeline(options, config, { replace: parseReplaceArg() })

  if (!supportsVendorMedia(branchSlug)) {
    console.log(`Skipping media for ${branchSlug} (no cover assets configured)`)
    return
  }

  console.log('')
  console.log('============================================================')
  console.log(`${branchSlug} — vendor media`)
  console.log('============================================================')

  await runVendorMediaPipeline(options, config)
}

export async function runAllShopsMigration(options: MigrationCliOptions) {
  const branches = resolveShopBranchSlugs()

  console.log('Shops migration (data + media)')
  console.log(options.remote ? 'Target: production D1 + R2' : 'Target: local D1 + R2')
  console.log(`Branches:         ${branches.join(', ')}`)

  if (options.dryRun) printDryRunBanner()

  for (const branchSlug of branches) {
    await runBranchMigration(options, branchSlug)
  }

  console.log('')
  console.log('All branches complete.')
}
