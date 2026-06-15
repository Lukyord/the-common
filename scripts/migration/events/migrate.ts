import {
  checkMigrationPrerequisites,
  printPrerequisiteResults,
} from '../lib/checkMigrationPrerequisites.js'
import { parseMigrationCliArgs, runMigrationScript } from '../lib/cli.js'
import { LEGACY_EVENTS_PATH } from './config/constants.js'
import { runMigrationPipeline } from './lib/migrationPipeline.js'

async function main() {
  const options = parseMigrationCliArgs()

  console.log('Legacy events migration pipeline')
  console.log('================================')

  printPrerequisiteResults(
    checkMigrationPrerequisites({ ...options, legacyDataPath: LEGACY_EVENTS_PATH }),
  )
  await runMigrationPipeline(options)
}

runMigrationScript(main)
