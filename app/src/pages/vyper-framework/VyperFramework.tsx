import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

import { defaultChain, wagmiConfig } from './wagmi'
import VyperApp from './VyperApp'
import './vyper-framework.css'

const queryClient = new QueryClient()

export default function VyperFramework() {
  return (
    <div className="vyper-framework-root">
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider initialChain={defaultChain}>
            <VyperApp />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}
