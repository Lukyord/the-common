import fs from 'fs'

import { collectSitemapUrls } from '../src/lib/sitemap/collectSitemapUrls.js'
import { sitemapEntriesToXml } from '../src/lib/sitemap/toXml.js'
import { getSiteOrigin } from '../src/lib/url.js'
import { getMigrationPayload } from './migration/lib/getPayloadLocal.js'
import { repoPath } from './migration/lib/paths.js'

type GenerateSitemapOptions = {
  remote: boolean
  outputPath: string
}

function parseArgs(argv = process.argv.slice(2)): GenerateSitemapOptions {
  const outputFlagIndex = argv.indexOf('--output')
  const outputPath =
    outputFlagIndex >= 0 && argv[outputFlagIndex + 1]
      ? argv[outputFlagIndex + 1]
      : repoPath('public/sitemap.xml')

  return {
    remote: argv.includes('--remote'),
    outputPath,
  }
}

async function main() {
  const options = parseArgs()

  console.log('Sitemap generator')
  console.log(options.remote ? 'Source: production D1' : 'Source: local D1')
  console.log(`Site: ${getSiteOrigin()}`)
  console.log(`Output: ${options.outputPath}`)
  console.log('================================')

  if (!process.env.NEXT_PUBLIC_SITE_URL && !process.env.SITE_URL) {
    console.warn(
      'Warning: NEXT_PUBLIC_SITE_URL is not set. Using default https://www.thecommonsbkk.com',
    )
  }

  const payload = await getMigrationPayload()
  const entries = await collectSitemapUrls(payload)
  const xml = sitemapEntriesToXml(entries)

  fs.mkdirSync(repoPath('public'), { recursive: true })
  fs.writeFileSync(options.outputPath, xml, 'utf8')

  console.log(`Wrote ${entries.length} URLs to ${options.outputPath}`)
  console.log('')
  console.log('Next steps after deploy:')
  console.log(`1. Verify ${getSiteOrigin()}/sitemap.xml loads in the browser`)
  console.log('2. In Google Search Console → Indexing → Sitemaps, submit: sitemap.xml')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
