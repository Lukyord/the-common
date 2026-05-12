import localFont from 'next/font/local'

export const akzidenzGrotesk = localFont({
  src: [
    {
      path: './akzidenz-grotesk-bq/AkzidenzGroteskBQ-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './akzidenz-grotesk-bq/AkzidenzGroteskBQ-LightIt.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './akzidenz-grotesk-bq/AkzidenzGroteskBQ-Reg.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './akzidenz-grotesk-bq/AkzidenzGroteskBQ-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './akzidenz-grotesk-bq/AkzidenzGroteskBQ-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './akzidenz-grotesk-bq/AkzidenzGroteskBQ-MedItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: './akzidenz-grotesk-bq/AkzidenzGroteskBQ-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './akzidenz-grotesk-bq/AkzidenzGroteskBQ-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-akzidenz-grotesk-bq',
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
})
