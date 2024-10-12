import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { ClusterProvider } from '@/components/cluster/cluster-data-access'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { UiLayout } from '@/components/ui/ui-layout'
import { ReactQueryProvider } from './react-query-provider'
import { metadata, viewport } from './metadata'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const links = [
  { label: 'Swap', path: '/' },
  { label: 'Account', path: '/account' }
]

export { metadata, viewport  }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script 
          src="https://terminal.jup.ag/main-v2.js" 
          strategy="afterInteractive"
        />
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>
                {children}
              </UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}