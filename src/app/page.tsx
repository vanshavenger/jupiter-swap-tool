'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

// Custom hook for script loading
function useScript(src: string): [boolean, string | null] {
  const [status, setStatus] = useState<[boolean, string | null]>([false, null])
  
  useEffect(() => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true

    const handleLoad = () => setStatus([true, null])
    const handleError = () => setStatus([false, `Failed to load script: ${src}`])

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
      document.head.removeChild(script)
    }
  }, [src])

  return status
}

function JupiterSwap() {
  const [isLoaded, error] = useScript("https://terminal.jup.ag/main-v2.js")
  const terminalRef = useRef<HTMLDivElement>(null)

  const initializeJupiter = useCallback(() => {
    if (window.Jupiter && terminalRef.current) {
      window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: 'integrated-terminal',
        endpoint: process.env.NEXT_PUBLIC_RPC_URL,
        strictTokenList: false,
        defaultExplorer: 'SolanaFM',
        formProps: {
          initialAmount: '10',
          initialInputMint: 'So11111111111111111111111111111111111111112',
          initialOutputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        },
      })
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      initializeJupiter()
    }
  }, [isLoaded, initializeJupiter])

  const content = useMemo(() => (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Jupiter Swap
        </h1>
        <div 
          ref={terminalRef}
          id="integrated-terminal" 
          className="rounded-2xl shadow-lg p-4 min-h-[400px]"
        />
      </div>
      {!isLoaded && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
        </div>
      )}
    </div>
  ), [isLoaded])

  if (error) {
    throw new Error(error)
  }

  return content
}

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">{error.message}</p>
        <button 
          onClick={resetErrorBoundary}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default function JupiterSwapWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <JupiterSwap />
    </ErrorBoundary>
  )
}