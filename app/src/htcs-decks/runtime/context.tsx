import { createContext, useContext } from 'react'
import type { DeckMeta, DeckRenderMode } from './types'

export const DeckMetaContext = createContext<DeckMeta | null>(null)
export const DeckRenderModeContext = createContext<DeckRenderMode>('interactive')

export function useDeckMeta() {
  const meta = useContext(DeckMetaContext)
  if (!meta) {
    throw new Error('HTCS deck primitives must be rendered inside a DeckMetaContext provider.')
  }
  return meta
}

export function useDeckRenderMode() {
  return useContext(DeckRenderModeContext)
}
