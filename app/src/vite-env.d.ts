/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WC_PROJECT_ID?: string
  readonly VITE_SEPOLIA_RPC_URL?: string
  readonly VITE_ARB_SEPOLIA_RPC_URL?: string
  readonly VITE_ARBITRUM_RPC_URL?: string
  readonly VITE_MAINNET_RPC_URL?: string
  readonly VITE_ANIMECHAIN_RPC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
