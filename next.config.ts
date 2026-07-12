import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'

const useLocalD1 = process.env.USE_LOCAL_D1 === 'true'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: '100mb',
    ...(useLocalD1 ? { cpus: 1 } : {}),
  },
  images: {
    unoptimized: true,
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  async redirects() {
    const branch = '(thonglor|saladaeng)'
    const branchSource = `/:branch${branch}`
    // Legacy blog slugs without a branch suffix; skip slugs that already end with -thonglor|-saladaeng
    const legacySlug = ':slug((?![^/]*-(?:thonglor|saladaeng)$)[^/]+)'

    return [
      // Legacy site-wide events hub
      {
        source: '/all/events',
        destination: '/whats-on',
        permanent: true,
      },

      // Legacy branch blog detail → brand blog with branch suffix
      {
        source: `${branchSource}/blogs/${legacySlug}`,
        destination: '/blogs/:slug-:branch',
        permanent: true,
      },

      // Legacy branch blog listing
      {
        source: `${branchSource}/blogs`,
        destination: '/blogs',
        permanent: true,
      },

      // Legacy find-us page
      {
        source: `${branchSource}/find-us`,
        destination: '/:branch/contact',
        permanent: true,
      },

      {
        source: `${branchSource}/about-us`,
        destination: '/about',
        permanent: true,
      },
      {
        source: `${branchSource}/events`,
        destination: '/:branch/whats-on',
        permanent: true,
      },
      {
        source: `${branchSource}/privacy`,
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: `${branchSource}/faqs`,
        destination: '/:branch/contact',
        permanent: true,
      },
      {
        source: `${branchSource}/event-space-rental`,
        destination: '/:branch/venue-rental',
        permanent: true,
      },
    ]
  },

  // Your Next.js config here
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
