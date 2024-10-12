'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { ExplorerLink } from '../cluster/cluster-ui'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui'

export default function AccountDetailFeature() {
  const params = useParams()
  const address = useMemo(() => {
    if (!params.address) {
      return
    }
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.error(`Invalid public key`, e)
    }
  }, [params])

  if (!address) {
    return (
      <div className="flex items-center justify-center h-screen" role="alert">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md" aria-live="assertive">
          <p className="font-bold">Error</p>
          <p>Unable to load account. Please check the address and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AppHero
        title={
          <div className="text-3xl md:text-4xl font-bold mb-2">
            <AccountBalance address={address} />
          </div>
        }
        subtitle={
          <div className="text-lg md:text-xl mb-4">
            <ExplorerLink path={`account/${address}`} label={ellipsify(address.toString())} />
          </div>
        }
      >
        <div className="mt-6">
          <AccountButtons address={address} />
        </div>
      </AppHero>
      
      <main className="mt-12 space-y-12">
        <section aria-labelledby="tokens-heading">
          <h2 id="tokens-heading" className="text-2xl font-semibold mb-4">Account Tokens</h2>
          <AccountTokens address={address} />
        </section>
        
        <section aria-labelledby="transactions-heading">
          <h2 id="transactions-heading" className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <AccountTransactions address={address} />
        </section>
      </main>
    </div>
  )
}