import {
  checkMigrationPrerequisites,
  printPrerequisiteResults,
} from '../lib/checkMigrationPrerequisites.js'
import { parseMigrationCliArgs, runMigrationScript } from '../lib/cli.js'
import { THONGLOR_VENDORS_CSV_PATH } from './config/constants.js'
import { runShopsMigrationPipeline } from './lib/migrationPipeline.js'

async function main() {
  const options = parseMigrationCliArgs()

  console.log('Thonglor vendors migration')
  console.log(options.remote ? 'Target: production D1' : 'Target: local D1')
  console.log('==========================')

  printPrerequisiteResults(
    checkMigrationPrerequisites({ ...options, legacyDataPath: THONGLOR_VENDORS_CSV_PATH }),
  )

  await runShopsMigrationPipeline(options)
}

runMigrationScript(main)
