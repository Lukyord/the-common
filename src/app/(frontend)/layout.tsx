import React from 'react'
import type { Metadata } from 'next'

import '@/styles/global.css'
import '@/styles/global-rwd.css'
import '@/styles/theme.css'
import '@/styles/theme-rwd.css'
import '@/styles/iconfont.css'
import 'lenis/dist/lenis.css'
import { akzidenzGrotesk } from '@/font/akzidenz-grotesk-bq'

import Theme from '@/components/theme'
import { SafariProvider } from '@/context/SafariContext'
import LenisProvider from '@/components/LenisProvider'

import { Header } from '@/components/header/Header'
import { Footer } from '@/components/footer/Footer'
import ClientInit from '@/components/ClientInit'
import ToasterProvider from '@/components/ToasterProvider'

export const metadata: Metadata = {
  description: 'The Common',
  title: 'The Common Description',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-invert.ico',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={akzidenzGrotesk.variable}>
      <SafariProvider>
        <LenisProvider>
          <body>
            <div id="page">
              <Theme />
              <ClientInit />
              <ToasterProvider />

              <Header />
              {children}
              <Footer />
            </div>
          </body>
        </LenisProvider>
      </SafariProvider>
    </html>
  )
}
