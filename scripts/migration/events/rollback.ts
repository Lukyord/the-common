import {
  checkRollbackPrerequisites,
  printPrerequisiteResults,
} from '../lib/checkMigrationPrerequisites.js'
import { parseMigrationCliArgs, runMigrationScript } from '../lib/cli.js'
import { runRollbackPipeline } from './lib/rollbackPipeline.js'

async function main() {
  const options = parseMigrationCliArgs()

  console.log('Legacy events migration rollback')
  console.log('================================')

  printPrerequisiteResults(checkRollbackPrerequisites(options.dryRun))
  await runRollbackPipeline(options)
}

runMigrationScript(main)
