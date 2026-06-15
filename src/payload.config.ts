import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig, type PayloadLogger } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Lifestyle } from './payload/collections/Lifestyle'
import { Branches } from './payload/collections/Branches'
import { BranchContactPages } from './payload/collections/BranchContactPages'
import { BranchSpaceRentalPages } from './payload/collections/BranchSpaceRentalPages'
import { BranchVendorPages } from './payload/collections/BranchVendorPages'
import { BranchWhatsOnPages } from './payload/collections/BranchWhatsOnPages'
import { Blogs } from './payload/collections/Blogs'
import { VendorCategories } from './payload/collections/VendorCategories'
import { Vendors } from './payload/collections/Vendors'
import { WhatsOn } from './payload/collections/WhatsOn'
import { WhatsOnMainTags } from './payload/collections/WhatsOnMainTags'
import { WhatsOnSubTags } from './payload/collections/WhatsOnSubTags'
import { About } from './payload/globals/About'
import { Contact } from './payload/globals/Contact'
import { Homepage } from './payload/globals/Homepage'
import { PrivacyPolicy } from './payload/globals/PrivacyPolicy'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) => {
  if (!value) return false
  const resolved = realpath(value)
  return resolved?.endsWith(path.join('payload', 'bin.js')) ?? false
})
const isProduction = process.env.NODE_ENV === 'production'
const useLocalD1 = process.env.USE_LOCAL_D1 === 'true'

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as unknown as PayloadLogger

const cloudflare =
  isCLI || !isProduction || useLocalD1
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/components/payload/admin-graphics',
        Icon: '@/components/payload/admin-graphics#AdminIcon',
      },
    },
  },
  collections: [
    Users,
    Media,
    // Branches first in sidebar (group order follows first collection in this list)
    Branches,
    BranchContactPages,
    BranchSpaceRentalPages,
    BranchVendorPages,
    BranchWhatsOnPages,
    Blogs,
    Vendors,
    WhatsOn,
    // Miscellaneous last in sidebar (group order follows first collection in this list)
    Lifestyle,
    VendorCategories,
    WhatsOnMainTags,
    WhatsOnSubTags,
  ],
  globals: [About, Contact, Homepage, PrivacyPolicy],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || cloudflare.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    seoPlugin({
      globals: [About.slug, Contact.slug, Homepage.slug, PrivacyPolicy.slug],
      collections: [
        Branches.slug,
        BranchContactPages.slug,
        BranchSpaceRentalPages.slug,
        BranchVendorPages.slug,
        BranchWhatsOnPages.slug,
        Blogs.slug,
        Vendors.slug,
        WhatsOn.slug,
      ],
      tabbedUI: true,
      uploadsCollection: Media.slug,
      generateTitle: ({ doc }) => doc?.name || doc?.title || doc?.hero?.title || 'The Common',
      generateDescription: ({ doc }) =>
        doc?.description || doc?.about?.description || doc?.membership?.[0]?.description,
      generateImage: ({ doc }) => doc?.hero?.backgroundMedia,
      generateURL: () => process.env.NEXT_PUBLIC_SITE_URL || '/',
    }),
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
  upload: {
    uploadTimeout: 300000,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  },
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction && !useLocalD1,
      } satisfies GetPlatformProxyOptions),
  )
}
