import { parseMigrationCliArgs, runMigrationScript } from '../lib/cli.js'
import { runVendorMediaCleanup } from './lib/cleanupVendorMedia.js'

async function main() {
  await runVendorMediaCleanup(parseMigrationCliArgs())
}

runMigrationScript(main)
