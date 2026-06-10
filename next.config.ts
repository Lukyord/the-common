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
