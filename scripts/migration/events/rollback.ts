import {
  checkRollbackPrerequisites,
  printPrerequisiteResults,
} from '../lib/checkMigrationPrerequisites.js'
import { parseMigrationCliArgs, runMigrationScript } from '../lib/cli.js'
import { runRollbackPipeline } from './lib/rollbackPipeline.js'

async function main() {
  const options = parseMigrationCliArgs()

  console.log('Legacy events migration rollback')
  console.log(options.remote ? 'Target: production D1 + R2' : 'Target: local D1 + R2')
  console.log('================================')

  printPrerequisiteResults(checkRollbackPrerequisites(options.dryRun, options.remote))
  await runRollbackPipeline(options)
}

runMigrationScript(main)
