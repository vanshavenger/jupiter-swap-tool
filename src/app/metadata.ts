import { Metadata, Viewport } from 'next'

const APP_NAME = 'Solana Jupiter Swap'
const APP_DEFAULT_TITLE = 'Solana Jupiter Swap | Fast Token Swaps on Solana'
const APP_TITLE_TEMPLATE = '%s - Solana Jupiter Swap'
const APP_DESCRIPTION = 'Swap tokens quickly and efficiently on the Solana blockchain using Jupiter aggregator. Built by Vansh.'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: ['Solana', 'Jupiter', 'Swap', 'DeFi', 'Cryptocurrency', 'Blockchain', 'Token Exchange'],
  authors: [{ name: 'Vansh', url: 'https://github.com/vanshavenger' }],
  creator: 'Vansh',
  metadataBase: new URL('https://vansh.dsandev.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    creator: '@Vansh_Avenger',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}