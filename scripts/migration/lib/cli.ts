export type MigrationCliOptions = {
  dryRun: boolean
  limit: number | null
  indexes: number[] | null
  localAssetsDir: string | null
  keepCache: boolean
}

function parseIndexesArg(argv: string[]): number[] | null {
  const flagIndex = argv.indexOf('--indexes')
  if (flagIndex < 0 || !argv[flagIndex + 1]) return null

  const indexes = argv[flagIndex + 1]
    .split(',')
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value))

  if (!indexes.length) {
    throw new Error(`Invalid --indexes value: ${argv[flagIndex + 1]}`)
  }

  return indexes
}

export function parseMigrationCliArgs(
  argv = process.argv.slice(2).filter((arg) => arg !== '--'),
): MigrationCliOptions {
  const dryRun = !argv.includes('--write')
  const limitFlagIndex = argv.indexOf('--limit')
  const limit =
    limitFlagIndex >= 0 && argv[limitFlagIndex + 1]
      ? Number.parseInt(argv[limitFlagIndex + 1], 10)
      : null

  const assetsFlagIndex = argv.indexOf('--assets-dir')
  const localAssetsDir =
    assetsFlagIndex >= 0 && argv[assetsFlagIndex + 1] ? argv[assetsFlagIndex + 1] : null

  return {
    dryRun,
    limit: Number.isFinite(limit) ? limit : null,
    indexes: parseIndexesArg(argv),
    localAssetsDir,
    keepCache: argv.includes('--keep-cache'),
  }
}

export function printDryRunBanner() {
  console.log('DRY RUN — no database writes. Pass --write to import.')
}

export function runMigrationScript(main: () => Promise<void>) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
