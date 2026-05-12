import React from 'react'
import type { Metadata } from 'next'

import '@/styles/global.css'
import '@/styles/global-rwd.css'
import '@/styles/theme.css'
import '@/styles/theme-rwd.css'
import '@/styles/iconfont.css'
import 'lenis/dist/lenis.css'

import { SafariProvider } from '@/context/SafariContext'
import Theme from '@/components/theme'

export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <SafariProvider>
        <body>
          <div id="page">
            <Theme />
            {children}
          </div>
        </body>
      </SafariProvider>
    </html>
  )
}
